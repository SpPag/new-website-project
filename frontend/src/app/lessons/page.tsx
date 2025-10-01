import { HomeButton } from "@/components/HomeButton";

export default function LessonsPage() {

	return (
		<div className="h-screen relative text-zinc-800">
			{/* Background image */}
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: "url('/bg_v1.jpg')" }}
			/>

			{/* Semi-transparent overlay */}
			<div className="absolute inset-0 bg-white/30"></div>

			{/* Home button */}
			<div className="z-20 absolute top-2 left-6 mt-4 text-white flex">
				<HomeButton />
			</div>

			{/* Content */}
			<div className="relative z-10 flex flex-col items-center pt-8 font-sans">
				<div className="text-3xl mb-10">
					Μαθήματα
				</div>
			</div>
		</div>
	);
}
