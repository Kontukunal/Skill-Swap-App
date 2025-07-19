import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  updateDoc,
  orderBy,
  writeBatch,
  getDocs,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import ChatHeader from "../components/sessions/ChatHeader";
import MessageList from "../components/sessions/MessageList";
import MessageInput from "../components/sessions/MessageInput";
import SessionSidebar from "../components/sessions/SessionSidebar";
import { toast } from "react-hot-toast";
import { generateMeetingLink } from "../utils/meetingUtils";

const SessionsPage = () => {
  const { currentUser } = useAuth();
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all unique sessions for the current user
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "exchanges"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const sessionsMap = new Map();

      for (const docSnapshot of snapshot.docs) {
        const session = { id: docSnapshot.id, ...docSnapshot.data() };
        const otherUserId = session.participants.find(
          (id) => id !== currentUser.uid
        );

        if (otherUserId) {
          if (sessionsMap.has(otherUserId)) {
            const existingSession = sessionsMap.get(otherUserId);
            sessionsMap.set(otherUserId, {
              ...existingSession,
              ...session,
              lastMessage: session.lastMessage || existingSession.lastMessage,
            });
          } else {
            const userDoc = await getDoc(doc(db, "users", otherUserId));
            if (userDoc.exists()) {
              session.otherUser = userDoc.data();
            }
            sessionsMap.set(otherUserId, session);
          }
        }
      }

      setSessions(Array.from(sessionsMap.values()));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Set active session
  useEffect(() => {
    if (sessions.length > 0) {
      if (sessionId) {
        const foundSession = sessions.find((s) => s.id === sessionId);
        setActiveSession(foundSession || sessions[0]);
      } else {
        setActiveSession(sessions[0]);
        if (sessions[0]) {
          navigate(`/sessions/${sessions[0].id}`);
        }
      }
    }
  }, [sessions, sessionId, navigate]);

  const handleSendMessage = async (messageText) => {
    if (!activeSession || !messageText.trim()) return;

    try {
      await addDoc(collection(db, "exchanges", activeSession.id, "messages"), {
        text: messageText,
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        senderPhoto: currentUser.photoURL,
        timestamp: serverTimestamp(),
        type: "text",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please check your permissions.");
    }
  };

  // Fetch messages for active session
  useEffect(() => {
    if (!activeSession) return;

    const q = query(
      collection(db, "exchanges", activeSession.id, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        type: doc.data().type || "text",
        text: doc.data().text || "",
        senderId: doc.data().senderId || "",
        timestamp: doc.data().timestamp || serverTimestamp(),
        senderName: doc.data().senderName || "Unknown",
        senderPhoto: doc.data().senderPhoto || "",
        meetingLink: doc.data().meetingLink || null,
        resourceTitle: doc.data().resourceTitle || "",
        resourceUrl: doc.data().resourceUrl || "",
      }));

      setMessages(messagesData);

      if (messagesData.length > 0) {
        const lastMsg = messagesData[messagesData.length - 1];
        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSession.id
              ? {
                  ...s,
                  lastMessage: {
                    text: lastMsg.text,
                    timestamp: lastMsg.timestamp,
                  },
                }
              : s
          )
        );
      }
    });

    return () => unsubscribe();
  }, [activeSession]);

  const handleSendResource = async (resource) => {
    if (!activeSession) return;
    try {
      await addDoc(collection(db, "exchanges", activeSession.id, "messages"), {
        type: "resource",
        resourceUrl: resource.url,
        resourceTitle: resource.title,
        resourceType: resource.type,
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        senderPhoto: currentUser.photoURL,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sharing resource:", error);
      toast.error("Failed to share resource. Please check your permissions.");
    }
  };

  const handleClearChat = async () => {
    if (
      !activeSession ||
      !window.confirm("Are you sure you want to clear this chat?")
    )
      return;

    try {
      const messagesQuery = query(
        collection(db, "exchanges", activeSession.id, "messages")
      );
      const snapshot = await getDocs(messagesQuery);

      const batch = writeBatch(db);
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      toast.success("Chat cleared successfully");
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast.error("Failed to clear chat");
    }
  };

  const handleScheduleSession = async (sessionData) => {
    if (!activeSession) return;

    try {
      const meetingLink = generateMeetingLink();

      await updateDoc(doc(db, "exchanges", activeSession.id), {
        date: sessionData.date,
        time: sessionData.time,
        duration: sessionData.duration,
        meetingLink,
        status: "scheduled",
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "exchanges", activeSession.id, "messages"), {
        type: "video",
        text: `Session scheduled for ${sessionData.date} at ${sessionData.time} (${sessionData.duration} minutes)`,
        meetingLink,
        timestamp: serverTimestamp(),
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        senderPhoto: currentUser.photoURL,
      });

      toast.success("Session scheduled successfully!");
    } catch (error) {
      toast.error("Failed to schedule session");
      console.error("Error scheduling session:", error);
    }
  };

  const filteredSessions = sessions.filter((session) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      session.otherUser?.displayName?.toLowerCase().includes(searchLower) ||
      session.skillToTeach?.toLowerCase().includes(searchLower) ||
      session.skillToLearn?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            No exchange sessions found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Start by requesting a skill exchange from the Explore page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <SessionSidebar
        sessions={filteredSessions}
        activeSession={activeSession}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSessionSelect={(session) => {
          setActiveSession(session);
          navigate(`/sessions/${session.id}`);
        }}
      />

      {activeSession ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatHeader
            session={activeSession}
            currentUser={currentUser}
            onScheduleSession={handleScheduleSession}
            onClearChat={handleClearChat}
          />

          <MessageList
            messages={messages}
            currentUserId={currentUser.uid}
            session={activeSession}
          />

          <MessageInput
            onSendMessage={handleSendMessage}
            onSendResource={handleSendResource}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            Select a session to start chatting
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
