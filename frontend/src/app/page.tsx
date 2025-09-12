export default function Home() {
	return (
		<div className="h-screen relative">
			{/* Background image */}
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: "url('/bg_v1.jpg')" }}
			/>

			{/* Semi-transparent overlay */}
			<div className="absolute inset-0 bg-white/30"></div>

			{/* Content */}
			<div className="relative z-10 text-zinc-800 flex flex-col items-center pt-8 text-3xl text-white font-sans">
				Nick's Guitar Lessons
			</div>
		</div>
	);
}
