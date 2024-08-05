import Image from "next/image"
import logo from "../../../../public/logo.png"

export default function SalesCard({
  name,
  email,
  image,
  amount,
}: SalesCardProps) {
  return (
    <div className="flex flex-wrap justify-between gap-3">
      <section className="flex justify-between gap-3 ">
        <div className=" h-12 w-12 rounded-full bg-gray-100 p-1">
          <Image
            width={200}
            height={200}
            src={image ? image : logo.src}
            alt="avatar"
            className="rounded-full"
          />
        </div>
        <div className="text-sm">
          <p>{name}</p>
          <div className="text-ellipsis overflow-hidden whitespace-nowrap w-[120px]  sm:w-auto  text-gray-400">
            {email}
          </div>
        </div>
      </section>
      <p>{amount}</p>
    </div>
  )
}

type SalesCardProps = {
  name: string
  email: string
  image?: string
  amount: string
}
