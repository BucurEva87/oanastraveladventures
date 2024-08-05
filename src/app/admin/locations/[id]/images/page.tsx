import ImageGalleryForm from "@/app/admin/_components/ImageGalleryForm"
import prisma from "@/prisma/client"
import { notFound } from "next/navigation"
import { LRUCache } from "lru-cache"
import { ResourceApiResponse } from "cloudinary"
import { getImages, deleteImages } from "@/app/actions/cloudinary"

const cache = new LRUCache({
  max: 100,
  ttl: 1000 * 8,
})

const LocationPageImages = async ({
  params: { id },
}: LocationPageImagesProps) => {
  const location = await prisma.location.findUnique({
    where: { id },
  })

  if (!location) return notFound()

  const cacheKey = `cloudinary-resources-${id}`
  let response = cache.get(cacheKey) as ResourceApiResponse

  if (!response) {
    response = await getImages(id)
    cache.set(cacheKey, response)
  }

  return (
    <>
      <h1>Manage images for location {location.name}</h1>
      <ImageGalleryForm
        id={id}
        type="location"
        images={response.resources.map((image) => image.secure_url)}
        deleteImagesFn={deleteImages}
      />
    </>
  )
}

type LocationPageImagesProps = {
  params: {
    id: string
  }
}

export default LocationPageImages
