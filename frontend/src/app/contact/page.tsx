export default function ContactPage() {
	const greekNa = '\u03bd\u03b1';

	return (
		<div className="h-screen relative text-zinc-800 dark:text-zinc-200">
			{/* Background image */}
			<div
				className="absolute inset-0 bg-cover bg-center "
				style={{ backgroundImage: "url('/bg2.jpg')" }}
			/>

			{/* Semi-transparent overlay */}
			<div className="absolute inset-0 bg-white/40 dark:bg-black/40"></div>

			{/* Title */}
			<div className="relative flex flex-col items-center pt-8 font-sans">
				<div className="text-3xl mb-10">
					Επικοινωνία
				</div>
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
