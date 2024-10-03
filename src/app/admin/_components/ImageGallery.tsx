"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import styled from "styled-components"
import { cn, getImagePublicId } from "@/lib/utils"

const ImageGallery = ({ images, deleteImagesFn }: ImageGalleryProps) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>(images)
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const handleSelectImage = (src: string) => {
    setSelectedImages((prev) =>
      prev.includes(src) ? prev.filter((img) => img !== src) : [...prev, src]
    )
  }

  const handleDeleteImages = async () => {
    await deleteImagesFn(getImagePublicId(selectedImages))

    setUploadedImages((prev) =>
      prev.filter((image) => !selectedImages.includes(image))
    )
    setSelectedImages([])
  }

  return (
    <GalleryContainer>
      {uploadedImages.map((src, index) => (
        <ImageWrapper key={index}>
          <Image
            src={src}
            alt={`Gallery image ${index + 1}`}
          />
          <Input
            type="checkbox"
            className={cn(
              "absolute top-0 -left-12 z-10",
              selectedImages.includes(src) ? "opacity-100" : "opacity-60"
            )}
            checked={selectedImages.includes(src)}
            onChange={() => handleSelectImage(src)}
          />
        </ImageWrapper>
      ))}
      {selectedImages.length > 0 && (
        <button
          type="button"
          onClick={handleDeleteImages}
          className="fixed bottom-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg"
        >
          Delete Selected
        </button>
      )}
    </GalleryContainer>
  )
}

const GalleryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
`

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover img {
    transform: scale(1.1);
  }

  &:hover::after {
    opacity: 0.6;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    min-width: 150px;
    min-height: 150px;
    background: rgba(0, 0, 0, 0.2);
    transition: opacity 0.3s ease;
    opacity: 0;
  }
`

const Image = styled.img`
  display: block;
  width: 150px;
  height: 150px;
  object-fit: cover;
  transition: transform 0.3s ease;
`

type ImageGalleryProps = {
  images: string[]
  deleteImagesFn: (images: string[]) => Promise<void>
}

export default ImageGallery
