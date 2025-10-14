import Link from "next/link";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

const Footer = () => {
	return (
		<div className="absolute bottom-2 left-0 w-full flex space-x-2 justify-center items-center z-10 text-zinc-800 dark:text-zinc-200 ">
			{/* Email */}
			{/* <div className="pr-2">
				Email: <a href="mailto:whodis@example.com">whodis@example.com</a>
			</div> */}

			{/* Phone */}
			{/* <div className="pr-2">
				Τηλέφωνο: <a href="tel:+1234567890">+30 123 456 7890</a>
			</div> */}

			{/* Email */}
			<div className="flex items-center space-x-2 pr-2">
				<EnvelopeIcon className="w-5 h-5 text-gray-400 dark:text-zinc-200" />
				<a
					href="mailto:whodis@example.com"
					className="hover:text-blue-400 transition-colors"
				>
					whodis@example.com
				</a>
			</div>

			{/* Phone */}
			<div className="flex items-center space-x-2 pr-2">
				<PhoneIcon className="w-5 h-5 text-gray-400 dark:text-zinc-200" />
				<a
					href="tel:+1234567890"
					className="hover:text-blue-400 transition-colors"
				>
					+30 123 456 7890
				</a>
			</div>

			{/* Instagram */}
			<Link
				href="https://instagram.com"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Instagram"
				className="hover:text-gray-400 transition-colors"
			>
				<svg
					className="w-6 h-6"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 1.5A4.26 4.26 0 0 0 3.5 7.75v8.5A4.26 4.26 0 0 0 7.75 20.5h8.5a4.26 4.26 0 0 0 4.25-4.25v-8.5A4.26 4.26 0 0 0 16.25 3.5h-8.5Zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5Zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5ZM17.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
				</svg>
			</Link>

			{/* Facebook */}
			<Link
				href="https://facebook.com"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Facebook"
				className="hover:text-blue-500 transition-colors"
			>
				<svg
					className="w-6 h-6"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12z" />
				</svg>
			</Link>

			{/* Twitter / X */}
			<Link
				href="https://twitter.com"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Twitter"
				className="hover:text-sky-400 transition-colors"
			>
				<svg
					className="w-6 h-6"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4.36a9.1 9.1 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.1 0c-2.5 0-4.5 2.1-4.5 4.6 0 .36.04.7.1 1A12.9 12.9 0 0 1 3 1s-4 9 5 13a13.4 13.4 0 0 1-7.9 2c9 5.8 20 0 20-11.5 0-.17 0-.35-.01-.52A9 9 0 0 0 23 3z" />
				</svg>
			</Link>

			{/* LinkedIn */}
			<Link
				href="https://linkedin.com"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="LinkedIn"
				className="hover:text-blue-600 transition-colors"
			>
				<svg
					className="w-6 h-6"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M19 0h-14C2.7 0 1.9.8 1.9 1.9v20.2C1.9 23.2 2.7 24 3.9 24H20c1.2 0 2-.8 2-1.9V1.9C22 .8 21.2 0 20 0zM7.1 20.5H4.1v-11h3v11zm-1.5-12.7c-1 0-1.8-.8-1.8-1.8S4.6 4.2 5.6 4.2c1 0 1.8.8 1.8 1.8S6.6 7.8 5.6 7.8zm14.9 12.7h-3v-5.6c0-1.3 0-3-1.9-3s-2.2 1.5-2.2 2.9v5.7h-3v-11h2.8v1.5h.1c.4-.8 1.4-1.5 2.9-1.5 3.1 0 3.7 2 3.7 4.6v6.4z" />
				</svg>
			</Link>
		</div>
	)
};

export { Footer };