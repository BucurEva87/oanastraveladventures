import prisma from "@/prisma/client"
import ImageCityPageForm from "./Form"
import { notFound } from "next/navigation"
import PageTitle from "@/app/admin/_components/PageTitle"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const ImageCityPage = async ({ params: { id } }: Props) => {
  const city = await prisma.city.findUnique({
    where: { id },
  })

  if (!city) return notFound()

  // const resources = await cloudinary.search.expression("converse").execute()
  const resources = await cloudinary.api.resources_by_tag("test")
  console.log(resources)

  return (
    <>
      <PageTitle title={city.name} />
      <ImageCityPageForm />
    </>
  )
}

type Props = {
  params: {
    id: string
  }
}

export default ImageCityPage
