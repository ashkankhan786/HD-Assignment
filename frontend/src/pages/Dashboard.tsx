import { useCallback, useEffect, useState } from "react";
import { NoteCard } from "../components/NoteCard";
import { useNavigate } from "react-router";
import {
  fetchUserProfile,
  fetchNotes,
  createNoteAPI,
  deleteNoteAPI,
} from "../services/api";
import { signOut } from "../utils/auth";
import { toast } from "react-toastify";
import { X } from "lucide-react";

interface Note {
  content: string;
  user: string;
  _id: string;
  createdAt: string;
}

const Dashboard = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    toast.success("Logged out successfully");
    navigate("/signin");
  };

  const fetchUserAndNotes = useCallback(async () => {
    try {
      const [userRes, notesRes] = await Promise.all([
        fetchUserProfile(),
        fetchNotes(),
      ]);
      setUser(userRes.data);
      setNotes(notesRes.data.notes);
    } catch (err) {
      console.error("Auth failed:", err);
      signOut();
      navigate("/signin");
    }
  }, [navigate]);

  const handleCreateNote = async () => {
    if (!noteText.trim()) return;

    try {
      const res = await createNoteAPI(noteText);
      toast.success(res.data.message);
      fetchUserAndNotes();
    } catch {
      toast.error("Could not create note");
    } finally {
      setNoteText("");
      setDialogOpen(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const res = await deleteNoteAPI(id);
      toast.success(res.data.message);
      fetchUserAndNotes();
    } catch {
      toast.error("Could not delete note");
    }
  };

  useEffect(() => {
    fetchUserAndNotes();
  }, [fetchUserAndNotes]);

  return (
    <>
      <div
        className={`${
          dialogOpen ? "opacity-50" : "opacity-100"
        } relative min-h-screen w-screen flex flex-col md:px-10 md:py-8 px-7 py-5 gap-12`}
      >
        {/* Header */}
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-6">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.1424 0.843087L16.9853 0L14.3248 9.89565L11.9228 0.961791L8.76555 1.80488L11.3608 11.4573L4.8967 5.01518L2.58549 7.31854L9.67576 14.3848L0.845959 12.0269L0 15.1733L9.64767 17.7496C9.53721 17.2748 9.47877 16.7801 9.47877 16.2717C9.47877 12.6737 12.4055 9.75685 16.0159 9.75685C19.6262 9.75685 22.5529 12.6737 22.5529 16.2717C22.5529 16.7768 22.4952 17.2685 22.3861 17.7405L31.1541 20.0818L32 16.9354L22.314 14.3489L31.1444 11.9908L30.2984 8.84437L20.6128 11.4308L27.0768 4.98873L24.7656 2.68538L17.7737 9.65357L20.1424 0.843087Z"
                fill="#367AFF"
              />
              <path
                d="M22.3776 17.7771C22.1069 18.9176 21.5354 19.9421 20.7513 20.763L27.1033 27.0935L29.4145 24.7901L22.3776 17.7771Z"
                fill="#367AFF"
              />
              <path
                d="M20.6871 20.8292C19.8936 21.637 18.8907 22.2398 17.7661 22.5504L20.0775 31.1472L23.2346 30.3041L20.6871 20.8292Z"
                fill="#367AFF"
              />
              <path
                d="M17.6481 22.5819C17.1264 22.7156 16.5795 22.7866 16.0159 22.7866C15.4121 22.7866 14.8273 22.705 14.2723 22.5523L11.9588 31.1569L15.1159 32L17.6481 22.5819Z"
                fill="#367AFF"
              />
              <path
                d="M14.1607 22.5205C13.0533 22.1945 12.0683 21.584 11.2909 20.7739L4.92328 27.1199L7.23448 29.4233L14.1607 22.5205Z"
                fill="#367AFF"
              />
              <path
                d="M11.2378 20.7178C10.4737 19.9026 9.91721 18.8917 9.65231 17.7688L0.855743 20.1179L1.7017 23.2643L11.2378 20.7178Z"
                fill="#367AFF"
              />
            </svg>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="underline text-blue-500 text-sm"
          >
            Sign Out
          </button>
        </div>

        {/* Profile */}
        <div className="border p-4 rounded-lg shadow">
          <h2 className="font-bold text-lg">Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
        </div>

        {/* Create Note Button */}
        <div className="w-full flex justify-center">
          <button
            onClick={() => setDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Create Note
          </button>
        </div>

        {/* Notes List */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-medium">Your Notes</h3>
          {notes.length === 0 && <p className="text-gray-500">No notes yet.</p>}
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              content={note.content}
              id={note._id}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      </div>

      {/* Create Note Dialog */}
      {dialogOpen && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white p-6 rounded-lg shadow-lg border">
          <div className="flex justify-end">
            <X
              className="cursor-pointer"
              onClick={() => setDialogOpen(false)}
            />
          </div>
          <input
            type="text"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Enter your note"
            className="w-full border p-2 mt-4 rounded-md"
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={handleCreateNote}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
