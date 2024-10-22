"use client"
import { Carousel } from "@material-tailwind/react";
import Image from 'next/image';
import { carouselData } from './data';

export default function CarouselSection() {
    return (

        <Carousel
            className="relative after:absolute after:inset-0 after:bg-black/30"
            loop
            autoplay
            autoplayDelay={3000}
            prevArrow={({ handleNext }) => (<></>)}
            nextArrow={({ handleNext }) => (<></>)}
            navigation={({ setActiveIndex, activeIndex, length }) => (
                <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                    {new Array(length).fill("").map((_, i) => (
                        <span
                            key={i}
                            className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                                }`}
                            onClick={() => setActiveIndex(i)}
                        />
                    ))}
                </div>
            )}
        >
            {carouselData.map((item, index) => (<Image
                key={index}
                src={item.url}
                alt={item.alt}
                width={1000}
                height={1000}
                className="h-full w-full object-cover"
            />))}

        </Carousel>
    )
}
