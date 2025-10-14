type TestimonialCardProps = {
    image: string;
    text: string;
    name: string;
};

const TestimonialCard = ({ image, text, name }: TestimonialCardProps) => {
    return (
        <div className="
                z-20 rounded-3xl w-3/4 sm:w-100 md:w-full max-w-75 aspect-[1.618]
                bg-sky-400/45 backdrop-blur-xs backdrop-saturate-50 hover:bg-sky-400/45
                dark:bg-gray-800/50 dark:backdrop-blur-none dark:backdrop-saturate-none dark:hover:bg-gray-800/50
                flex items-center justify-center text-center
                ">
            <div className="max-w-md mx-auto">
                <img src={image} alt={name} className="
                                                absolute top-4 left-4 w-24 h-24 md:w-18 md:h-18 lg:w-24 lg:h-24 rounded-full
          object-cover border-2 border-white/40
                                                " />
                <blockquote className="absolute bottom-4 right-4 pl-[2rem] md:pl-[6rem] lg:pl-[4rem] text-right max-h-[calc(100%-2rem)] max-w-[12rem] overflow-y-auto">
                    <p className="md:text-sm lg:text-base italic text-zinc-800 dark:text-zinc-200">{text}</p>
                    <footer className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">{name}</footer>
                </blockquote>
            </div>
        </div>
    )
}

export { TestimonialCard }