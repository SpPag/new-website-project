import Link from "next/link";

type DropdownMenuItemProps = {
	href: string;
	label: string;
	onClick?: () => void;
};

const DropdownMenuItem = ({ href, label, onClick }: DropdownMenuItemProps) => {
	return (
		<Link
			href={href}
			onClick={onClick} // call parent close
			className="
    		block
			w-full
			text-center
    		px-2 py-2 sm:px-6 sm:py-2
    		hover:bg-sky-400/50
			dark:backdrop-blur-none dark:backdrop-saturate-100 dark:hover:brightness-90 dark:hover:bg-gray-700
			transition
			rounded-xl
        	"
		>
			{label}
		</Link>
	);
}

export { DropdownMenuItem };