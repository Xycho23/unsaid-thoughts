"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp, Timestamp, deleteDoc, getDocs } from "firebase/firestore";
import { auth, db } from "@/app/firebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Menu, MenuItem, MenuList, MenuButton } from "@chakra-ui/menu";
import Image from "next/image";

type Message = {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhotoURL: string;
  timestamp: Timestamp;
};

export default function WorldChats() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "world_chats"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Message)));
    });

    return () => unsubscribe();
  }, []);

  // Reset messages every 1 minute
  useEffect(() => {
    const resetInterval = setInterval(() => {
      resetChat();
    }, 60000); // 1 minute = 60,000 milliseconds

    return () => clearInterval(resetInterval);
  }, []);

  const resetChat = async () => {
    try {
      // Option 1: Clear messages from Firestore
      const messagesRef = collection(db, "world_chats");
      const messagesSnapshot = await getDocs(messagesRef);
      messagesSnapshot.forEach(async (doc: any) => {
        await deleteDoc(doc.ref);
      });

      // Option 2: Just clear the local state (if you don't want to delete from Firestore)
      setMessages([]);
    } catch (err) {
      console.error("Failed to reset chat:", err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      await addDoc(collection(db, "world_chats"), {
        text: newMessage,
        userId: user.uid,
        userName: user.displayName || "Anonymous User",
        userPhotoURL: user.photoURL || "/default-avatar.png",
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const blockUser = (userId: string) => {
    setBlockedUsers((prev) => [...prev, userId]);
  };

  const filteredMessages = messages.filter((msg) => !blockedUsers.includes(msg.userId));

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#3e2723] text-[#d7ccc8] p-6">
      {/* 🔙 Back Button */}
      <Link href="/" className="self-start mb-4">
        <Button className="bg-[#8d6e63] hover:bg-[#6d4c41] text-white" onClick={() => {}}>← Back to Home</Button>
      </Link>

      <h1 className="text-4xl font-extrabold mb-6 text-[#bcaaa4]">🌍 World Chat</h1>

      {/* � User Info Box */}
      {user && (
        <div className="w-full max-w-3xl bg-[#5d4037] p-4 rounded-lg shadow-lg border-4 border-[#8d6e63] mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={user.photoURL || "/default-avatar.png"}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="text-lg font-semibold">{user.displayName || "Anonymous User"}</p>
              <p className="text-sm text-gray-400">Online</p>
            </div>
          </div>
          <Menu>
            <MenuButton as={Button} className="bg-[#5d4037] text-white px-3 py-2 rounded">
              ⋮
            </MenuButton>
            <MenuList className="bg-[#5d4037] text-[#d7ccc8] border border-[#8d6e63]">
              <MenuItem onClick={() => alert(`View profile of ${user.displayName}`)} value="viewProfile">👤 View Profile</MenuItem>
              <MenuItem onClick={() => blockUser(user.uid)} value="blockUser">🚫 Block</MenuItem>
            </MenuList>
          </Menu>
        </div>
      )}

      {/* 📜 Chat Messages */}
      <div className="w-full max-w-3xl bg-[#5d4037] p-6 rounded-lg shadow-lg border-4 border-[#8d6e63] mb-8 h-[500px] overflow-y-auto">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className="mb-4 flex flex-col items-start gap-3 bg-[#8d6e63] p-3 rounded-lg shadow-md cursor-pointer"
            onClick={() => setSelectedMessage(selectedMessage === msg.id ? null : msg.id)}
          >
            <div className="flex items-center gap-3">
              <Image
                src={msg.userPhotoURL || "/default-avatar.png"}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
              <p className="text-sm text-gray-200 font-semibold">{msg.userName}</p>
            </div>
            {selectedMessage === msg.id && (
              <p className="bg-[#bcaaa4] text-[#3e2723] p-3 rounded-lg">{msg.text}</p>
            )}
          </div>
        ))}
      </div>

      {/* 💬 Message Input Box */}
      {user ? (
        <div className="w-full max-w-3xl flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-3 border rounded-md text-[#3e2723] bg-[#d7ccc8] placeholder-gray-600"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button
              onClick={sendMessage}
              className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors"
            >
              Send 💬
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-red-400">⚠ Please log in to send messages</p>
      )}
    </div>
  );
}