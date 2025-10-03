'use client'

import { useEffect, useRef, useState } from "react";
import { DropdownMenuItem } from "./DropdownMenuItem";

const MenuDropdown = () => {

	const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Close dropdown if clicked outside
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setDropdownIsOpen(false);
			}
		};

		// Close dropdown if ESC is pressed
		const handleEscPress = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setDropdownIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscPress);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscPress);
		};
	}, []);

	// Set array to iterate over to create menu items
	const menuItems = [
		{ href: "/", label: "Αρχική" },
		{ href: "/contact", label: "Επικοινωνία" },
		{ href: "/lessons", label: "Μαθήματα" },
	];

	return (
		<div ref={dropdownRef} className="z-20 absolute left-2 top-2">
			<button
				onClick={() => setDropdownIsOpen(!dropdownIsOpen)}
				id="dropdownDefaultButton"
				data-dropdown-toggle="dropdown"
				className="
					z-20 text-sm text-center inline-flex items-center px-10 py-2
					bg-sky-400/45 backdrop-blur-xs backdrop-saturate-50 hover:bg-sky-400/65
					dark:bg-gray-700 dark:backdrop-blur-none dark:backdrop-saturate-none dark:hover:bg-gray-800
					transition
					border dark:border-zinc-400 rounded-lg
					shadow
					"
				type="button">
				Menu
				<svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
					<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
				</svg>
			</button>

			{dropdownIsOpen && (
				<div id="dropdown" className="bg-sky-300/55 dark:bg-gray-600 rounded-lg shadow-xl/20 w-35">
					{menuItems.map((item) => (
						<DropdownMenuItem
							key={item.href}
							href={item.href}
							label={item.label}
							onClick={() => setDropdownIsOpen(false)}
						/>
					))}
				</div>)}
		</div>
	)
};

export { MenuDropdown };