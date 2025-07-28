import { Trash2 } from "lucide-react";

interface NoteCardProps {
  content: string;
  id: string;
  onDelete: (id: string) => void;
}

export const NoteCard = ({ content, id, onDelete }: NoteCardProps) => {
  return (
    <div className="w-full h-12 py-5 px-4 rounded-2xl border border-[#D9D9D9] shadow-xs shadow-[#00000096] flex items-center">
      <p className="text-[#232323] flex-1">{content}</p>
      <Trash2
        className="text-[#050400] h-4 w-4 cursor-pointer"
        onClick={() => onDelete(id)}
      />
    </div>
  );
};
