import ReactPlayer from "react-player";

const VideoSection = () => {
	return (
		// ==================================== LOCAL VIDEO ====================================
		// Use this if you have a local video file (e.g., MP4) in your public folder

		// <div className="
		// 	relative z-10 w-1/2 mt-8
		// 	">
		// 	<video
		// 		className="w-full rounded-xl"
		// 		controls
		// 	// poster="/thumbnail.jpg" // optional preview image
		// 	>
		// 		<source src="/sample.mp4" type="video/mp4" />
		// 		Your browser does not support the video tag.
		// 	</video>
		// </div>
		// ==================================== LOCAL VIDEO ====================================

		// =================================== YOUTUBE VIDEO ===================================
		// Use this if you want to embed a YouTube video

		// <iframe
		// 	className="
		// 	relative z-10 w-1/2 mt-8
		// 	aspect-video rounded-xl
		// 	"
		// 	src="https://www.youtube.com/embed/du-TY1GUFGk?rel=0"
		// 	title="Sample"
		// 	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		// 	allowFullScreen
		// ></iframe>
		// =================================== YOUTUBE VIDEO ===================================

		// ==================================== VIMEO VIDEO ====================================
		// Use this if you want to embed a Vimeo video

		<div className="
			relative z-10 w-1/2 mt-8
			aspect-video rounded-xl overflow-hidden
			">
			<ReactPlayer
				src="https://vimeo.com/76979871"
				controls
				width="100%"
				height="100%"
			/>
		</div>
		// ==================================== VIMEO VIDEO ====================================
	);
}

export { VideoSection }