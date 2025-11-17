"use client";

import { useState, useRef } from "react";
import { mockLessons } from "@/data/mockLessons";
import { Lesson } from "@/types/Lesson";
import { LessonForm } from "@/components/LessonForm";

export default function AdminPage() {
	const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
	const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [toastMessage, setToastMessage] = useState<string | null>(null);
	const [showingToast, setShowingToast] = useState(false);
	const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const removeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleSave = (lessonData: Omit<Lesson, "id">) => {
		if (editingLesson) {
			// Update existing lesson
			setLessons((prev) =>
				prev.map((lesson) =>
					lesson.id === editingLesson.id ? { ...lesson, ...lessonData } : lesson
				)
			);
		} else {
			// Add new lesson
			const newLesson: Lesson = {
				id: Date.now().toString(),
				...lessonData,
			};
			setLessons((prev) => [newLesson, ...prev]);
		}
		closeModal();
	};

	const openModalForNew = () => {
		setEditingLesson(null);
		setShowModal(true);
	};

	const openModalForEdit = (lesson: Lesson) => {
		setEditingLesson(lesson);
		setShowModal(true);
	};

	const closeModal = () => {
		setEditingLesson(null);
		setShowModal(false);
	};

	const openDeleteModal = (lesson: Lesson) => {
		setLessonToDelete(lesson);
		setShowDeleteModal(true);
	};

	const closeDeleteModal = () => {
		setLessonToDelete(null);
		setShowDeleteModal(false);
	};

	const confirmDelete = () => {
		if (lessonToDelete) {
			setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonToDelete.id));
			showToast(`"${lessonToDelete.title}" has been deleted.`);
		}
		closeDeleteModal();
	};

	const showToast = (message: string, duration = 3000) => {
		// Clear existing timers if a toast is currently showing
		if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
		if (removeTimeoutRef.current) clearTimeout(removeTimeoutRef.current);

		setToastMessage(message);
		setShowingToast(true);

		// Schedule fade out
		toastTimeoutRef.current = setTimeout(() => {
			setShowingToast(false);
		}, duration);

		// Schedule removal after fade out
		removeTimeoutRef.current = setTimeout(() => {
			setToastMessage(null);
		}, duration + 300); // match transition duration
	};

	return (
		<div className="p-6">
			<button
				className="bg-green-500 text-white px-4 py-2 rounded mb-4"
				onClick={openModalForNew}
			>
				Add New Lesson
			</button>

			{/* Lessons list */}
			{/* Scrollable container */}
			<div className="h-[calc(100vh-150px)] overflow-y-auto">
				{/* Grid of lessons */}
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{lessons.map((lesson) => (
						<div
							key={lesson.id}
							className="flex justify-between items-center border p-4 rounded overflow-x-auto max-w-full break-words"
						>
							<div>
								<h3 className="font-semibold">{lesson.title}</h3>
								<p>{lesson.description}</p>
								<p className="font-bold">${lesson.price}</p>
							</div>
							<div className="flex gap-2">
								<button
									className="bg-blue-500 text-white px-3 py-1 rounded"
									onClick={() => openModalForEdit(lesson)}
								>
									Edit
								</button>
								<button
									className="bg-red-500 text-white px-3 py-1 rounded"
									onClick={() => openDeleteModal(lesson)}
								>
									Delete
								</button>
							</div>
						</div>
					))}

				</div>
			</div>

			{/* New / edit lesson Modal */}

			{showModal && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
					onClick={closeModal} // click on overlay closes
				>
					<div
						className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg"
						onClick={(e) => e.stopPropagation()} // prevent clicks inside modal from closing
					>
						<h2 className="text-xl font-bold mb-4">
							{editingLesson ? "Edit Lesson" : "Add New Lesson"}
						</h2>
						<LessonForm lesson={editingLesson ?? undefined} onSave={handleSave} />
						<button
							onClick={closeModal}
							className="mt-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
						>
							Cancel
						</button>
					</div>
				</div>
			)}

			{/* Delete lesson Modal */}

			{showDeleteModal && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
					onClick={closeDeleteModal} // clicking outside closes modal
				>
					<div
						className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-sm shadow-lg"
						onClick={(e) => e.stopPropagation()} // prevent modal clicks from closing
					>
						<h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
						<p className="mb-4">
							Are you sure you want to delete "{lessonToDelete?.title}"?
						</p>
						<div className="flex justify-end gap-2">
							<button
								onClick={closeDeleteModal}
								className="px-4 py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
							>
								Cancel
							</button>
							<button
								onClick={confirmDelete}
								className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Toast Notification */}

			{toastMessage && (
				<div
					className={`fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300 ${showingToast ? "opacity-100" : "opacity-0"
						}`}
				>
					{toastMessage}
				</div>
			)}

		</div>
	);
}
