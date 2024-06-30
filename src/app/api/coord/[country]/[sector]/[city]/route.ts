import { noDia, sortDesc } from "@/lib/utils"
import { NextRequest, NextResponse } from "next/server"

const baseURL = 'https://geocode.maps.co/search?q='

export async function GET(request: NextRequest, { params: { country, sector, city }}: Params) {
  try {
    const apiURL = `${baseURL}${city}&country=${country}&api_key=${process.env.GEOCODE_API_KEY}`
    const response = await fetch(apiURL)
    const data = await response.json()

    if (data.length) {
      const item = data
        .filter((i: { display_name: string}) => {
          const modified = noDia(i.display_name)
            .replace(/.+?, /, '')
            .toLowerCase()

          return modified.includes(
            noDia(sector).toLowerCase()) || modified.includes(noDia(country).toLowerCase()
          )
        })
        .sort(sortDesc('importance'))[0]

      return NextResponse.json([
        parseFloat(item.lat) || null,
        parseFloat(item.lon) || null
      ])
    }

    return NextResponse.json([null, null])
  } catch (error) {
    return NextResponse.json([null, null])
  }
}

type Params = {
  params: {
    country: string;
    sector: string;
    city: string;
  }
}
