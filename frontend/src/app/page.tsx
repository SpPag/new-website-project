import { ContactButton } from "@/components/ContactButton";
import { Introduction } from "../components/Introduction";
import { VideoSection } from "../components/VideoSection";
import { LessonsButton } from "@/components/LessonsButton";

export default function HomePage() {
	return (
		<div className="h-screen relative">
			{/* Background image */}
			<div
				className="absolute inset-0 bg-cover bg-center dark:brightness-160"
				style={{ backgroundImage: "url('/bg4.jpg')" }}
			/>

			{/* Semi-transparent overlay */}
			<div className="absolute inset-0 dark:bg-black/50"></div>

			{/* Title */}
			<div className="relative z-10 text-zinc-800 dark:text-zinc-200 flex flex-col items-center pt-8 text-3xl font-sans">
				Nick's Guitar Lessons
			</div>

			{/* Contact and lessons button */}
			<div className="z-10 absolute top-2 right-6 mt-4 dark:text-zinc-200 flex space-x-2">
				<ContactButton />
				<LessonsButton />
			</div>

			{/* Main content */}
			<div className="flex flex-col space-x-4 mx-4 items-center">
				<Introduction />
				<VideoSection />
			</div>

		</div>
	);
}
