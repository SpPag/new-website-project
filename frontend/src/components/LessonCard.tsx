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
				p-6 w-19/20 sm:w-full mx-auto
				rounded-lg
				border border-zinc-600
				backdrop-blur-xs backdrop-saturate-75 brightness-90 hover:bg-sky-400/40 bg-sky-400/20
				dark:backdrop-blur-none dark:backdrop-saturate-100 dark:brightness-100 dark:bg-gray-700 dark:hover:brightness-100 dark:hover:bg-gray-800
				shadow-lg/20 dark:shadow-none
				">
			{/* Use the combination of overflow-x-auto and whitespace-nowrap for overflow on x*/}
			{/* <div className="overflow-x-auto whitespace-nowrap pb-1">
				<h2 className="text-xl sm:text-xl dark:text-zinc-200 font-semibold mb-4">{title}</h2>
			</div> */}
			{/* Use the combination of overflow-y-auto and max-h-<any-value> for overflow on y*/}
			<div className="overflow-y-auto max-h-9 pb-1">
				<h2 className="text-xl sm:text-xl dark:text-zinc-200 font-semibold">{title}</h2>
			</div>
			<div className="mt-2 flex-1 overflow-y-auto pr-1 h-20">
				<p className="text-md sm:text-md dark:text-zinc-300 mb-2">{description}</p>
			</div>
			<p className="text-lg font-bold text-green-600 dark:text-emerald-600">${price}</p>
		</a>
	);
};

export { LessonCard }