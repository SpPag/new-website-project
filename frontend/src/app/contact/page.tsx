import { HomeButton } from "@/components/HomeButton";

export default function ContactPage() {
	const greekNa = '\u03bd\u03b1';

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
					Επικοινωνία
				</div>
				<div>
					Για οποιεσδήποτε απορίες ή πληροφορίες, μη διστάσετε {greekNa} επικοινωνήσετε μαζί μου!
				</div>
				<div>
					Θα χαρώ {greekNa} σας βοηθήσω με ό,τι χρειαστείτε σχετικά με τα μαθήματα κιθάρας. (ιδιαίτερα, ομαδικά, online)
				</div>
			</div>

		{/* Contact info pinned to bottom, feel free to uncomment this if you want to switch to having it only here, instead of in the layout */}
		<div className="absolute bottom-8 left-0 w-full flex justify-center z-10">
			<div className="mr-4">
				Email: <a href="mailto:whodis@example.com">whodis@example.com</a>
			</div>
			<div>
				Τηλέφωνο: <a href="tel:+1234567890">+30 123 456 7890</a>
			</div>
		</div>
	</div>
	);
}
