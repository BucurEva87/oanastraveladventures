"use client"

import { Form } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { CldUploadWidget } from "next-cloudinary"
import ImageGallery from "@/components/ImageGallery"

const baseUrl = "https://res.cloudinary.com/dcmecrobh/image/upload/"
const images = [
  "v1719825700/vx37fangzts58z5hfvme.jpg",
  "v1719825681/cagp263qnquusfuznyzs.jpg",
  "v1696709733/djsrasqwx6y7svzguamr.jpg",
  "v1696709712/mvel5rebedozyllk3vp4.jpg",
  "v1696706225/cld-sample-5.jpg",
  "v1696706225/cld-sample-4.jpg",
  "v1696706222/samples/woman-on-a-football-field.jpg",
]

const ImageCityPageForm = () => {
  return (
    <>
      <div className="flex justify-center">
        <ImageGallery images={images.map((image) => `${baseUrl}${image}`)} />
      </div>

      <CldUploadWidget signatureEndpoint="/api/sign-image">
        {({ open }) => {
          return (
            <button
              type="button"
              onClick={() => open()}
            >
              Upload an Image
            </button>
          )
        }}
      </CldUploadWidget>
    </>
  )
}

export default ImageCityPageForm
