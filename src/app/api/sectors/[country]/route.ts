import { sortAsc } from "@/lib/utils"
import { SectorGivenFromAPI } from "@/types"
import { NextRequest, NextResponse } from "next/server"

const apiURL = {
  romania: "https://roloca.coldfuse.io/judete"
}

export async function GET(request: NextRequest, { params: { country } }: Params) {
  if (!country) return NextResponse.json([])

  const url = apiURL[country.toLowerCase() as keyof typeof apiURL]

  if (!url) return NextResponse.json([])

  try {
    const response = await fetch(url)
    const sectors: SectorGivenFromAPI[] = await response.json()

    if (!sectors || !sectors.length)
      return NextResponse.json([])

    return NextResponse.json(
      sectors
        .map(sector => ({
          name: sector.nume,
          auto: sector.auto
        }))
        .sort(sortAsc('name'))
    )
  } catch (error) {
    return NextResponse.json([])
  }
}

type Params = {
  params: {
    country: string
  }
}
