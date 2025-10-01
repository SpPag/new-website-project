type LessonCardProps = {
	title: string;
	description: string;
	price: number;
};

const LessonCard = ({ title, description, price }: LessonCardProps) => {
	return (
		<a
			href="/"
			className="
				p-6
				rounded-lg
				border border-zinc-600
				backdrop-blur-xs backdrop-saturate-75 brightness-90 hover:bg-sky-400/40 bg-sky-400/20
				dark:backdrop-blur-none dark:backdrop-saturate-100 dark:brightness-100 dark:bg-gray-700 dark:hover:brightness-100 dark:hover:bg-gray-800 transition duration-300
				shadow-lg/20 dark:shadow-none
				">
			<h2 className="text-2xl dark:text-zinc-200 font-semibold mb-4">{title}</h2>
			<p className="dark:text-zinc-300 mb-2">{description}</p>
			<p className="text-lg font-bold text-green-600 dark:text-emerald-600">${price}</p>
		</a>
	);
};

export { LessonCard }