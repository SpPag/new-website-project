export default function ContactPage() {
	const greekNa = '\u03bd\u03b1';

	return (
		<div className="h-screen relative text-zinc-800 dark:text-zinc-200">
			{/* Background image */}
			<div
				className="absolute inset-0 bg-cover bg-center saturate-125"
				style={{ backgroundImage: "url('/bg2.jpg')" }}
			/>

			{/* Semi-transparent overlay */}
			<div className="absolute inset-0 bg-white/40 dark:bg-black/40"></div>

			{/* Title - could be placed in the layout and display a different title for each page, but for now I'm keeping it here since I don't know if we may need different functionality for some pages */}
			<div className="relative flex flex-col items-center pt-8 font-sans text-2xl sm:text-2xl md:text-3xl mb-10 text-zinc-800 dark:text-zinc-200">
				Επικοινωνία
			</div>

			{/* Contact info */}
			<div className="relative flex flex-col items-center pt-8 font-sans">
				<div>
					Για οποιεσδήποτε απορίες ή πληροφορίες, μη διστάσετε {greekNa} επικοινωνήσετε μαζί μου!
				</div>
				<div>
					Θα χαρώ {greekNa} σας βοηθήσω με ό,τι χρειαστείτε σχετικά με τα μαθήματα κιθάρας (ιδιαίτερα, ομαδικά, online).
				</div>
			</div>
		</div>
	);
}
