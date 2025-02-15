"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebaseConfig";
import { signOut } from "firebase/auth";
import { User } from "firebase/auth";
import { db } from "@/app/firebaseConfig";
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { motion } from "framer-motion";

type Note = {
  id: string;
  content: string;
  postedTo: "world" | "local";
  userId: string;
  replies: { userId: string; content: string }[]; // Updated replies structure
};

export default function Homepage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const router = useRouter();

  // Fetch user data and notes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        const q = query(collection(db, "notes"), where("userId", "==", currentUser.uid));
        const unsubscribeNotes = onSnapshot(q, (snapshot) => {
          const notesData: Note[] = [];
          snapshot.forEach((doc) => {
            notesData.push({ id: doc.id, ...doc.data() } as Note);
          });
          setNotes(notesData);
        });

        return () => unsubscribeNotes();
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setError("Logout failed. Please try again.");
    }
  };

  // Add a new note
  const handleAddNote = async (postedTo: "world" | "local") => {
    if (newNote.trim() === "" || !user) return;
    setIsAddingNote(true);
    try {
      await addDoc(collection(db, "notes"), {
        content: newNote,
        postedTo,
        userId: user.uid,
        replies: [],
      });
      setNewNote("");
      setShowInput(false);
    } catch (error) {
      console.error("Error adding note:", error);
      setError("Failed to add note. Please try again.");
    } finally {
      setIsAddingNote(false);
    }
  };

  // Add a reply to a note
  const handleReply = async (id: string) => {
    if (replyText.trim() === "" || !user) return;
    setIsReplying(true);
    try {
      const noteRef = doc(db, "notes", id);
      const note = notes.find((note) => note.id === id);
      if (note) {
        await updateDoc(noteRef, {
          replies: [...note.replies, { userId: user.uid, content: replyText }],
        });
        setReplyText("");
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      setError("Failed to add reply. Please try again.");
    } finally {
      setIsReplying(false);
    }
  };

  // Delete a note
  const handleDeleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, "notes", id));
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Failed to delete note. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#3e2723] text-[#d7ccc8]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#3e2723] text-[#d7ccc8] p-6">
      {/* User Info (Top Right) */}
      {user && (
        <div className="absolute top-5 right-5 bg-[#5d4037] p-4 rounded-lg shadow-md border-2 border-[#8d6e63] text-sm">
          <p className="font-semibold">Welcome, {user.email}</p>
        </div>
      )}

      {/* Sticky Notes Board */}
      <div className="w-full max-w-6xl bg-[#5d4037] p-10 rounded-lg shadow-xl border-8 border-[#8d6e63] mb-8">
        <h2 className="text-2xl font-semibold mb-6">Your Sticky Notes Board</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <motion.div
              key={note.id}
              className="relative w-48 h-48 p-4 bg-[#f5deb3] text-[#3e2723] shadow-lg rounded-lg border-2 border-[#8d6e63] flex flex-col justify-center items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Pin Icon */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#8d6e63] rounded-full flex items-center justify-center">
                <span className="text-[#3e2723] text-sm">📍</span>
              </div>
              {/* Note Content */}
              <div className="text-center font-semibold text-sm md:text-base">
                {note.content}
              </div>
              {/* Posted To Label */}
              <p className="text-xs text-[#5d4037] mt-2">
                Posted to:{" "}
                <span className="font-semibold">
                  {note.postedTo === "world" ? "World Board" : "Local Board"}
                </span>
              </p>
              {/* Reply Section */}
              <div className="mt-2 w-full flex flex-col items-center">
                <button
                  className="text-xs bg-[#8d6e63] hover:bg-[#6d4c41] text-[#d7ccc8] px-2 py-1 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReplyingTo(note.id);
                  }}
                >
                  Reply
                </button>
                {replyingTo === note.id && (
                  <div className="mt-2 w-full px-2">
                    <textarea
                      className="w-full p-2 border rounded-md text-[#3e2723] bg-[#d7ccc8] mb-2 shadow-md"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button
                      className="w-full text-xs bg-[#8d6e63] hover:bg-[#6d4c41] text-[#d7ccc8] px-2 py-1 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReply(note.id);
                      }}
                      disabled={isReplying}
                    >
                      {isReplying ? "Posting..." : "Post Reply"}
                    </button>
                  </div>
                )}
                {note.replies.length > 0 && (
                  <div className="mt-2 text-xs text-[#3e2723] bg-[#d7ccc8] p-2 rounded-lg shadow-inner w-full">
                    <strong>Replies:</strong>
                    {note.replies.map((reply, index) => (
                      <p key={index} className="mt-1">- {reply.content}</p>
                    ))}
                  </div>
                )}
              </div>
              {/* Delete Button */}
              <button
                className="absolute bottom-2 right-2 text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNote(note.id);
                }}
              >
                Delete
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Note Section */}
      <div className="w-full max-w-5xl mb-8">
        <button
          onClick={() => setShowInput(!showInput)}
          className="w-full bg-[#bcaaa4] p-3 rounded text-[#3e2723] font-semibold hover:bg-[#a1887f] transition-colors duration-200"
        >
          Write Unsaid Thought
        </button>
        {showInput && (
          <div className="mt-4 bg-[#5d4037] p-6 rounded-lg shadow-lg w-full border-2 border-[#8d6e63]">
            <textarea
              className="w-full p-4 border rounded-md text-[#3e2723] bg-[#d7ccc8] mb-4 shadow-md"
              placeholder="Write your unsaid thought..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <div className="flex gap-4">
              <button
                onClick={() => handleAddNote("local")}
                className="w-full bg-[#bcaaa4] p-3 rounded text-[#3e2723] font-semibold hover:bg-[#a1887f] transition-colors duration-200"
                disabled={isAddingNote}
              >
                {isAddingNote ? "Adding..." : "Add to Local Board"}
              </button>
              <button
                onClick={() => handleAddNote("world")}
                className="w-full bg-[#bcaaa4] p-3 rounded text-[#3e2723] font-semibold hover:bg-[#a1887f] transition-colors duration-200"
                disabled={isAddingNote}
              >
                {isAddingNote ? "Adding..." : "Post to World Board"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Buttons Below Board */}
      <div className="mt-6 flex flex-col gap-4 w-full max-w-sm">
        <button
          className="w-full bg-[#bcaaa4] p-3 rounded text-[#3e2723] font-semibold hover:bg-[#a1887f] transition-colors duration-200"
          onClick={() => router.push("/world-board")}
        >
          View World Board
        </button>
        <button
          className="w-full bg-[#bcaaa4] p-3 rounded text-[#3e2723] font-semibold hover:bg-[#a1887f] transition-colors duration-200"
          onClick={() => router.push("/world-chats")}
        >
          View World Chats
        </button>
      </div>

      {/* Logout Button (Bottom Right) */}
      <button
        className="absolute bottom-5 right-5 bg-red-500 p-3 rounded text-white font-semibold hover:bg-red-600 transition-colors duration-200"
        onClick={handleLogout}
      >
        Logout
      </button>

      {/* Error Message */}
      {error && (
        <div className="absolute bottom-20 right-5 bg-red-500 p-3 rounded text-white font-semibold">
          {error}
        </div>
      )}
    </div>
  );
}