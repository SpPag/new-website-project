import Link from "next/link";

type DropdownMenuItemProps = {
  href: string;
  label: string;
  onClick?: () => void;
};

const DropdownMenuItem = ({ href, label, onClick }: DropdownMenuItemProps) => {
  return (
    <li>
      <Link
        href={href}
		onClick={onClick} // call parent close
        className="
    		block
    		px-8 py-2
    		backdrop-blur-xs hover:bg-sky-400/50
			dark:backdrop-blur-none dark:backdrop-saturate-100 dark:hover:brightness-90 dark:hover:bg-gray-700
			transition
        	"
      >
        {label}
      </Link>
    </li>
  );
}

export { DropdownMenuItem };