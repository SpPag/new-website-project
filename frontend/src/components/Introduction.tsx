import React from "react";

const Introduction = () => {
	
	const Greeting = "Hello, my name is Nick and I'd love to share my love of the guitar with you."

	const Intro = "After years of experience and lots of work, I decided I wanted to create a platform from which I can share my knowledge with others. I hope you find this site useful and enjoyable. Feel free to send me an email for any questions regardless of whether you're a student or just someone who's interested in learning more about the guitar. I look forward to hearing from you."
	
	return (
		<div className="
		relative z-10 w-1/2 p-8 mt-8
		border-5 border-double rounded-4xl
		flex flex-col items-center justify-center
		text-xl text-zinc-800 font-sans
		">
			{/* Top-left corner */}
			<img src="/note.jpeg" alt="note" className="absolute top-2 left-2 w-10 h-12" />
			{/* Top-right corner */}
			<img src="/note.jpeg" alt="note" className="absolute top-2 right-2 w-10 h-12" />
			{/* Bottom-left corner */}
			<img src="/note.jpeg" alt="note" className="absolute bottom-2 left-2 w-10 h-12" />
			{/* Bottom-right corner */}
			<img src="/note.jpeg" alt="note" className="absolute bottom-2 right-2 w-10 h-12" />
			<div>{Greeting}</div>
			<div>{Intro}</div>
		</div>
	)
}

export { Introduction }