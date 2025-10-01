import { ContactButton } from "@/components/ContactButton";
import { Introduction } from "../components/Introduction";
import { VideoSection } from "../components/VideoSection";
import { LessonsButton } from "@/components/LessonsButton";

export default function HomePage() {
	return (
		<div className="h-screen relative">
			{/* Background image */}
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: "url('/bg_v1.jpg')" }}
			/>

			{/* Semi-transparent overlay */}
			<div className="absolute inset-0 bg-white/30"></div>

			{/* Title */}
			<div className="relative z-10 text-zinc-800 flex flex-col items-center pt-8 text-3xl font-sans">
				Nick's Guitar Lessons
			</div>

			{/* Contact and lessons button */}
			<div className="z-10 absolute top-2 right-6 mt-4 text-white flex space-x-2">
				<ContactButton />
				<LessonsButton />
			</div>

			{/* Main content */}
			<div className="flex space-x-4 mx-4">
				<Introduction />
				<VideoSection />
			</div>

		</div>
	);
}
