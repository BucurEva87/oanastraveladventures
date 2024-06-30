import { sortAsc } from "@/lib/utils"
import { CityGivenFromAPI } from "@/types"
import { NextRequest, NextResponse } from "next/server"

const apiURL = {
  romania: "https://roloca.coldfuse.io/orase"
}

export async function GET(request: NextRequest, { params: { country, sector} }: Params) {
  if (!country || !sector)
    return NextResponse.json([])

  const baseUrl = apiURL[country.toLowerCase() as keyof typeof apiURL]

  if (!baseUrl) return NextResponse.json([])

  try {
    const url = `${baseUrl}/${sector.toUpperCase()}`
    const response = await fetch(url)
    const cities: CityGivenFromAPI[] = await response.json()

    if (!cities || !cities.length)
      return NextResponse.json([])

    return NextResponse.json(
      cities
        .map(city => ({
          name: city.simplu ?? city.nume,
          commune: city.comuna
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
    sector: string
  }
}
