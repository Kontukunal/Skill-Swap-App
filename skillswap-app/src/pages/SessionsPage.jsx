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

  // Fetch all sessions for the current user
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "exchanges"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const sessionsData = [];
      for (const docSnapshot of snapshot.docs) {
        const session = { id: docSnapshot.id, ...docSnapshot.data() };
        const otherUserId = session.participants.find(
          (id) => id !== currentUser.uid
        );

        if (otherUserId) {
          const userDoc = await getDoc(doc(db, "users", otherUserId));
          if (userDoc.exists()) {
            session.otherUser = userDoc.data();
          }
        }
        sessionsData.push(session);
      }
      setSessions(sessionsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Set active session based on URL param or first session
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
  // In the message fetching useEffect:
  useEffect(() => {
    if (!activeSession) return;

    const q = query(
      collection(db, "exchanges", activeSession.id, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type || "text",
          text: data.text || "",
          senderId: data.senderId || "",
          timestamp: data.timestamp || serverTimestamp(),
          senderName: data.senderName || "Unknown",
          senderPhoto: data.senderPhoto || "",
          meetingLink: data.meetingLink || null,
          resourceTitle: data.resourceTitle || "",
          resourceUrl: data.resourceUrl || "",
        };
      });

      setMessages(messagesData);

      // Update last message for sidebar - only include primitive values
      if (messagesData.length > 0) {
        const lastMsg = messagesData[messagesData.length - 1];
        const lastMessage = {
          text: lastMsg.text,
          timestamp: lastMsg.timestamp,
        };
        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSession.id ? { ...s, lastMessage } : s
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

      // Add a system message about the scheduled session
      await addDoc(collection(db, "exchanges", activeSession.id, "messages"), {
        type: "system",
        text: `Session scheduled for ${sessionData.date} at ${sessionData.time} (${sessionData.duration} minutes)`,
        meetingLink,
        timestamp: serverTimestamp(),
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
          />

          <MessageList
            messages={messages}
            currentUserId={currentUser.uid}
            session={activeSession}
          />

          <MessageInput
            onSendMessage={handleSendMessage}
            onSendResource={handleSendResource}
            onScheduleSession={handleScheduleSession}
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
