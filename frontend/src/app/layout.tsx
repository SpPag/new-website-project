import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Nick's Guitar Lessons",
	description: "music, lessons, guitar",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
				{/* Contact info pinned to bottom, feel free to comment this out if you want to switch to having it only in the 'contact' page */}
				{/* <div className="absolute bottom-8 left-0 w-full flex justify-center z-20 text-zinc-800">
					<div className="mr-4">
						Email: <a href="mailto:whodis@example.com">whodis@example.com</a>
					</div>
					<div>
						Τηλέφωνο: <a href="tel:+1234567890">+30 123 456 7890</a>
					</div>
				</div> */}
			</body>
		</html>
	);
}
