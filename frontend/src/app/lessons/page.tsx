import { LessonCard } from "@/components/LessonCard";

export default function LessonsPage() {

	return (
		<div className="h-screen relative text-zinc-800 dark:text-zinc-200">
			{/* Background image */}
			<div
				className="absolute inset-0 bg-cover bg-center saturate-125"
				style={{ backgroundImage: "url('/bg3.jpg')" }}
			/>

			{/* Semi-transparent overlay */}
			<div className="absolute inset-0 bg-white/40 dark:bg-black/35"></div>

			{/* Title - could be placed in the layout and display a different title for each page, but for now I'm keeping it here since I don't know if we may need different functionality for some pages */}
			<div className="relative flex flex-col items-center pt-8 font-sans text-2xl sm:text-2xl md:text-3xl mb-10 text-zinc-800 dark:text-zinc-200">
				Μαθήματα
			</div>

			{/* Lessons */}
			<div className="relative z-10 grid h-[calc(100vh-150px)] overflow-y-auto sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-8">
				{Array.from({ length: 22 }).map((_, index) => {
					const randomPrice = Math.floor(Math.random() * 51) + 20; // random between 20 and 70
					return (
						<LessonCard
							key={index}
							title={`Lesson #${index + 1}`}
							description={`Description for Lesson #${index + 1}`}
							price={randomPrice}
						/>
					);
				})}
			</div>
		</div>
	);
}
