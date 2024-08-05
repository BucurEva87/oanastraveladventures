"use client"

import { CldUploadWidget } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import ImageGallery from "./ImageGallery"

const ImageGalleryForm = ({
  id,
  type,
  images,
  deleteImagesFn,
}: ImageGalleryFormProps) => {
  return (
    <>
      {!!images.length ? (
        <div className="flex justify-center">
          <ImageGallery
            images={images}
            deleteImagesFn={deleteImagesFn}
          />
        </div>
      ) : (
        `No images uploaded for this ${type} yet`
      )}

      <div className="mt-4">
        <CldUploadWidget
          signatureEndpoint="/api/sign-image"
          options={{
            tags: [id, type],
          }}
        >
          {({ open }) => {
            return (
              <Button
                type="button"
                className="block mx-auto"
                onClick={() => open()}
              >
                {!!images.length ? "Upload more images" : "Upload some images"}
              </Button>
            )
          }}
        </CldUploadWidget>
      </div>
    </>
  )
}

type ImageGalleryFormProps = {
  id: string
  type: string
  images: string[]
  deleteImagesFn: (images: string[]) => Promise<void>
}

export default ImageGalleryForm
