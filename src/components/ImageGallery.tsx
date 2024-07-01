"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel"
import { CldImage } from "next-cloudinary"
import Image from "next/image"

const ImageGallery = ({ images }: { images: string[] }) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-lg"
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem
            key={index}
            className="md:basis-1/2 lg:basis-1/3"
          >
            <div className="p-1 w-[270px] h-[270px]">
              <Image
                key={index}
                src={image}
                width={500}
                height={500}
                alt="Some alt"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default ImageGallery
