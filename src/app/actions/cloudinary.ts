import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const getImages = async (tag: string) => {
  return await cloudinary.api.resources_by_tag(tag, {
    max_results: 20,
  })
}

export const deleteImages = async (images: string[]) => {
  "use server"

  if (!images.length) return

  await cloudinary.api.delete_resources(images, { type: 'authenticated', invalidate: true })
}

export default cloudinary
