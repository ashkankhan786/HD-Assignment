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
          <h1 className="text-xl font-semibold">Dashboard</h1>
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
