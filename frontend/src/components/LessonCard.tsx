type LessonCardProps = {
	title: string;
	description: string;
	price: number;
};

const LessonCard = ({ title, description, price }: LessonCardProps) => {
	return (
		<a
			href="/"
			className="p-6 backdrop-blur-xs dark:backdrop-blur-none backdrop-saturate-75 dark:backdrop-saturate-100 brightness-90 dark:brightness-100 dark:bg-zinc-800 rounded-lg hover:brightness-80 dark:hover:bg-zinc-800 transition duration-300 border-1 dark:border border-zinc-600 shadow-lg/20 dark:shadow-none">
			<h2 className="text-2xl dark:text-zinc-200 font-semibold mb-4">{title}</h2>
			<p className="dark:text-zinc-300 mb-2">{description}</p>
			<p className="text-lg font-bold text-green-600 dark:text-emerald-600">${price}</p>
		</a>
	);
};

export { LessonCard }