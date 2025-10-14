import { Introduction } from "../components/Introduction";
import { VideoSection } from "../components/VideoSection";
import { TestimonialCard } from "../components/TestimonialCard";

export default function HomePage() {

	const testimonials = [
		{ image: "/testimonial_placeholder.jpg", text: "Great experience! I'll recommend to all my friends!", name: "Maria" },
		{ image: "/testimonial_placeholder.jpg", text: "Loved the course! The content was engaging and well-structured.", name: "John" },
		{ image: "/testimonial_placeholder.jpg", text: "Highly recommend! The instructor was knowledgeable and supportive.", name: "Sofia" },
		{ image: "/testimonial_placeholder.jpg", text: "Very clear lessons! I learned a lot in a short time.", name: "Alex" },
	];

	return (
		<div className="h-screen relative">
			{/* Background image */}
			<div
				className="absolute inset-0 bg-cover bg-center dark:brightness-75 dark:saturate-150"
				style={{ backgroundImage: "url('/bg4.jpg')" }}
			/>

			{/* Semi-transparent overlay */}
			<div className="absolute inset-0 bg-gray-500/10 dark:bg-gray-800/50"></div>

			{/* Scrollable content */}
			<div className="relative z-10 h-[calc(100vh-60px)] sm:h-[calc(100vh-45px)] md:h-[calc(100vh-45px)] overflow-y-auto pb-10">

				{/* Title - could be placed in the layout and display a different title for each page, but for now I'm keeping it here since I don't know if we may need different functionality for some pages */}
				<div className="relative flex flex-col items-center mt-8 font-sans text-2xl sm:text-2xl md:text-3xl mb-6 md:mb-10 text-zinc-800 dark:text-zinc-200">
					Nick's Guitar Lessons
				</div>

				{/* Main content */}
				<div className="flex flex-col space-x-4 mx-4 items-center">
					<Introduction />
					<div className="flex flex-col md:flex-row w-full items-center justify-center gap-4 flex-1 mt-8">

						{/* Left column (first two) */}
						<div className="order-2 md:order-1 flex flex-col gap-4 items-center justify-start w-full md:w-1/4">
							{testimonials.slice(0, 2).map((t, i) => (
								<TestimonialCard key={i} {...t} />
							))}
						</div>

						{/* Center column */}
						<div className="order-1 md:order-2 flex justify-center items-center w-3/4 sm:w-100 md:w-100 lg:w-7/20 pb-4 sm:pb-0">
							<VideoSection />
						</div>

						{/* Right column (last two) */}
						<div className="order-3 md:order-3 flex flex-col gap-4 items-center justify-start w-full md:w-1/4">
							{testimonials.slice(2, 4).map((t, i) => (
								<TestimonialCard key={i + 2} {...t} />
							))}
						</div>

					</div>
				</div>
			</div>
		</div>
	);
}
