"use client";

import { useState, useRef } from "react";
import { mockLessons } from "@/data/mockLessons";
import { Lesson } from "@/types/Lesson";
import { LessonForm } from "@/components/LessonForm";

export default function AdminPage() {
	// State management
	const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
	const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [toastMessage, setToastMessage] = useState<string | null>(null);
	const [showingToast, setShowingToast] = useState(false);
	const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const removeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);

	// Functions setup
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

	const openPreviewModal = (lesson: Lesson) => setPreviewLesson(lesson);

	const closePreviewModal = () => setPreviewLesson(null);

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
		<div className="p-6 text-zinc-800 dark:text-zinc-200">
			{/* Background image */}
			<div
				className="absolute inset-0 bg-cover bg-center dark:brightness-80 saturate-100 -z-10"
				style={{ backgroundImage: "url('/bg1.jpg')" }}
			/>
			
			{/* Semi-transparent overlay */}
			<div className="absolute inset-0 bg-white/40 dark:bg-black/40 -z-10"></div>

			
			<button
				className="
					z-20 text-sm text-center flex items-center justify-center py-2 mb-4 sm:w-25 sm:w-32 md:w-35
					bg-sky-400/65 backdrop-blur-xs backdrop-saturate-50 hover:bg-sky-500/65
					dark:bg-gray-700 dark:backdrop-blur-none dark:backdrop-saturate-none dark:hover:bg-gray-800
					transition
					border border-black dark:border-zinc-400 rounded-lg
					shadow
					cursor-pointer
					"
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
							onClick={() => openPreviewModal(lesson)}
							className="
										flex flex-col border p-4 rounded max-w-full h-48
										hover:bg-gray-100 dark:hover:bg-gray-700 transition
									"
						>
							{/* Top Row: Title + Edit/Delete */}
							<div className="flex justify-between items-start">
								<h3 className="font-semibold text-lg">{lesson.title}</h3>

								<div className="flex gap-2 ml-4 shrink-0">
									<button
										className="bg-blue-500 text-white px-3 py-1 rounded hover:cursor-pointer"
										onClick={(e) => {
											e.stopPropagation();     // <-- prevents triggering the parent click
											openModalForEdit(lesson);
										}}
									>
										Edit
									</button>

									<button
										className="bg-red-500 text-white px-3 py-1 rounded hover:cursor-pointer"
										onClick={(e) => {
											e.stopPropagation();     // <-- prevents triggering the parent click
											openDeleteModal(lesson);
										}}
									>
										Delete
									</button>
								</div>
							</div>

							{/* Scrollable Description */}
							<div className="mt-2 flex-1 overflow-y-auto pr-1">
								<p className="text-sm break-words">{lesson.description}</p>
							</div>

							<p className="font-bold mt-2">${lesson.price}</p>
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

			{previewLesson && (
				<div
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
					onClick={closePreviewModal}
				>
					<div
						className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
						onClick={(e) => e.stopPropagation()}
					>
						<h2 className="text-xl font-bold mb-4">{previewLesson.title}</h2>
						<p className="mb-4">{previewLesson.description}</p>
						<p className="font-bold mb-6">${previewLesson.price}</p>

						<button
							className="text-gray-600 dark:text-gray-300 hover:underline"
							onClick={closePreviewModal}
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
