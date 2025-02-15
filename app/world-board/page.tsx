"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/app/firebaseConfig";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

type Note = {
  id: string;
  content: string;
  postedTo: "world";
  userId: string;
  replies: string[];
  userEmail: string;
};

export default function WorldBoard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Fetch World Notes
  useEffect(() => {
    const q = query(collection(db, "notes"), where("postedTo", "==", "world"));

    const unsubscribeNotes = onSnapshot(q, (snapshot) => {
      const notesData: Note[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Note;
        return { ...data, id: doc.id };
      });
      setNotes(notesData);
    });

    return () => unsubscribeNotes();
  }, []);

  // ✅ Handle Reply
  const handleReply = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      const noteRef = doc(db, "notes", id);
      const note = notes.find((note) => note.id === id);
      if (!note) return;

      await updateDoc(noteRef, {
        replies: [...note.replies, replyText],
      });

      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error adding reply:", error);
      setError("Failed to add reply. Please try again.");
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-[#3e2723] text-[#d7ccc8] p-6">
      {/* 🔙 Back Button */}
      <Button onClick={() => router.push("/")} className="absolute top-5 left-5 bg-[#8d6e63] hover:bg-[#6d4c41] text-white">
        ← Back to Home
      </Button>

      {/* 📜 Page Title */}
      <h1 className="text-5xl font-extrabold mb-6 text-[#bcaaa4] text-center">🌎 Board of Unsaid Thoughts</h1>

      {/* 📝 Notes Section */}
      <div className="relative w-full max-w-6xl bg-[#5d4037] p-10 rounded-lg shadow-xl border-8 border-[#8d6e63] flex flex-wrap gap-6 justify-center">
        {notes.length > 0 ? (
          notes.map((note) => (
            <motion.div
              key={note.id}
              className="relative w-64 min-h-56 p-4 bg-[#f5deb3] text-[#3e2723] shadow-lg rounded-lg border-2 border-[#8d6e63] flex flex-col justify-between"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* 📌 Pin Icon */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#8d6e63] rounded-full flex items-center justify-center">
                <span className="text-[#3e2723] text-sm">📍</span>
              </div>

              {/* 🏷️ Note Content */}
              <p className="text-lg font-semibold mb-4">{String(note.content)}</p>

              {/* 📝 User Info */}
              <p className="text-xs text-[#5d4037] mb-2">Posted by: {note.userEmail}</p>

              {/* 💬 Reply Section */}
              <div className="w-full flex flex-col items-center">
                <Button className="text-xs bg-[#8d6e63] hover:bg-[#6d4c41]" onClick={() => setReplyingTo(note.id)}>
                  Reply
                </Button>

                {replyingTo === note.id && (
                  <div className="mt-2 w-full">
                    <textarea
                      className="w-full p-2 border rounded-md text-[#3e2723] bg-[#d7ccc8] mb-2 shadow-md"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <Button onClick={() => handleReply(note.id)} className="w-full text-xs">
                      Post Reply
                    </Button>
                  </div>
                )}

                {/* 📩 Replies Section */}
                {note.replies.length > 0 && (
                  <div className="mt-4 text-xs text-[#3e2723] bg-[#d7ccc8] p-2 rounded-lg shadow-inner w-full">
                    <strong>Replies:</strong>
                    {note.replies.map((reply, index) => (
                      <p key={index} className="mt-1">{String(reply)}</p>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-300">No world notes yet.</p>
        )}
      </div>

      {/* 🚨 Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="fixed bottom-10 right-10 bg-red-500 p-3 rounded text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
