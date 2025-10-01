const ContactButton = () => {
	return (
		<a
			href="/contact"
			className="
				px-10 py-2
				backdrop-blur-xs backdrop-saturate-50 hover:brightness-90 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition
				border dark:border-zinc-400 rounded-lg
				shadow
				"
		>
			Επικοινωνία
		</a>
	);
};

export { ContactButton }