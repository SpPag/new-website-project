import { Introduction } from "../components/Introduction";
import { VideoSection } from "../components/VideoSection";

export default function HomePage() {
	return (
		<div className="h-screen relative">
			{/* Background image */}
			<div
				className="absolute inset-0 bg-cover bg-center dark:brightness-75 dark:saturate-150"
				style={{ backgroundImage: "url('/bg4.jpg')" }}
			/>

			{/* Semi-transparent overlay */}
			<div className="absolute inset-0 bg-gray-500/10 dark:bg-gray-800/50"></div>

			{/* Title - could be placed in the layout and display a different title for each page, but for now I'm keeping it here since I don't know if we may need different functionality for some pages */}
			<div className="relative z-10 text-zinc-800 dark:text-zinc-200 flex flex-col items-center pt-8 text-3xl font-sans">
				Nick's Guitar Lessons
			</div>

			{/* Main content */}
			<div className="flex flex-col space-x-4 mx-4 items-center">
				<Introduction />
				<VideoSection />
			</div>

		</div>
	);
}
