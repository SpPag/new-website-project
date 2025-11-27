import { useState } from "react";
import { Lesson } from "@/types/Lesson";

type LessonFormProps = {
  lesson?: Lesson; // optional for creating new lesson
  onSave: (lesson: Omit<Lesson, "id">) => void; // callback when saved
};

export const LessonForm = ({ lesson, onSave }: LessonFormProps) => {
  const [title, setTitle] = useState(lesson?.title || "");
  const [description, setDescription] = useState(lesson?.description || "");
  const [price, setPrice] = useState(lesson?.price || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, price });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-full p-2 border rounded"
        min={0}
        required
      />
      <button type="submit" className="bg-green-400 text-gray-900 hover:bg-green-500 dark:bg-green-700 dark:text-zinc-200 dark:hover:bg-green-600 px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
};
