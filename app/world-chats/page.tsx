"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from "firebase/firestore";
import { auth, db } from "@/app/firebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";

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
      <Link href="/" className="self-start mb-4">
        <Button className="bg-[#8d6e63] hover:bg-[#6d4c41] text-white" onClick={() => {}}>
          ← Back to Home
        </Button>
      </Link>

      <h1 className="text-4xl font-extrabold mb-6 text-[#bcaaa4]">🌍 World Chat</h1>

      {/* User Profile Info at the Top */}
      {user && (
        <div className="w-full max-w-3xl bg-[#5d4037] p-4 rounded-lg shadow-lg border-4 border-[#8d6e63] mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full"
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
              <MenuItem value="view-profile" onClick={() => alert(`View profile of ${user.displayName}`)}>
                👤 View Profile
              </MenuItem>
              <MenuItem value="block" onClick={() => blockUser(user.uid)}>
                🚫 Block
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      )}

      {/* Chat Box */}
      <div className="w-full max-w-3xl bg-[#5d4037] p-6 rounded-lg shadow-lg border-4 border-[#8d6e63] mb-8 h-[500px] overflow-y-auto">
        {filteredMessages.map((msg) => (
          <div key={msg.id} className="mb-4 flex items-start gap-3">
            <img
              src={msg.userPhotoURL || "/default-avatar.png"}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm text-gray-400">{msg.userName}</p>
              <p className="bg-[#bcaaa4] text-[#3e2723] p-3 rounded-lg">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
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