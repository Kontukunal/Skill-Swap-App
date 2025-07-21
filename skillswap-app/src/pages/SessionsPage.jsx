import React, { useState, useEffect, useCallback } from "react";
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
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";

const SessionsPage = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUserData = useCallback(async (userId) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists() ? userDoc.data() : null;
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "exchanges"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const sessionsMap = new Map();
      const promises = [];

      snapshot.docs.forEach((docSnapshot) => {
        const session = { id: docSnapshot.id, ...docSnapshot.data() };
        const otherUserId = session.participants.find(
          (id) => id !== currentUser.uid
        );

        if (!sessionsMap.has(docSnapshot.id)) {
          promises.push(
            fetchUserData(otherUserId).then((userData) => {
              if (userData) {
                session.otherUser = userData;
                sessionsMap.set(docSnapshot.id, session);
              }
            })
          );
        }
      });

      await Promise.all(promises);
      setSessions(Array.from(sessionsMap.values()));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, fetchUserData]);

  useEffect(() => {
    if (sessions.length > 0 && !loading) {
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
  }, [sessions, sessionId, navigate, loading]);

  useEffect(() => {
    if (!activeSession) return;

    const q = query(
      collection(db, "exchanges", activeSession.id, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp || serverTimestamp(),
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

      await updateDoc(doc(db, "exchanges", activeSession.id), {
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

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

      await updateDoc(doc(db, "exchanges", activeSession.id), {
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      toast.error("Failed to share resource");
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm("Are you sure you want to clear this chat?")) return;

    try {
      const messagesRef = collection(
        db,
        "exchanges",
        activeSession.id,
        "messages"
      );
      const snapshot = await getDocs(messagesRef);
      const batch = writeBatch(db);
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      await addDoc(messagesRef, {
        type: "system",
        text: `${currentUser.displayName} cleared the chat`,
        timestamp: serverTimestamp(),
        senderId: currentUser.uid,
      });

      toast.success("Chat cleared successfully");
    } catch (error) {
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
        <div className="text-center glass p-8 rounded-2xl">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            No exchange sessions found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Start by requesting a skill exchange from the Explore page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-screen ${theme.mode === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {theme.mode === "dark" ? (
          <>
            <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-indigo-900/10 blur-3xl animate-blob"></div>
            <div className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full bg-purple-900/10 blur-3xl animate-blob animation-delay-2000"></div>
          </>
        ) : (
          <>
            <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-indigo-100/40 blur-3xl animate-blob"></div>
            <div className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full bg-purple-100/40 blur-3xl animate-blob animation-delay-2000"></div>
          </>
        )}
      </div>

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
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
        </motion.div>
      ) : (
        <div className="flex-1 flex items-center justify-center glass rounded-xl m-4">
          <p className="text-gray-500 dark:text-gray-400">
            Select a session to start chatting
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
