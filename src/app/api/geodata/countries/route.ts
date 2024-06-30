import { sortAsc } from "@/lib/utils"
import { CountryGivenFromAPI } from "@/types"
import { NextRequest, NextResponse } from "next/server"

const url = "https://restcountries.com/v3.1/all"

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(url)
    const countries: CountryGivenFromAPI[] = await response.json()

    if (!countries || !countries.length)
      return NextResponse.json([])

    return NextResponse.json(
      countries
        .map((country) => ({
          name: country.name.common ?? country.name.official,
          flag: country.flag,
          code: country.cca2
        }))
        .sort(sortAsc('name'))
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json([])
  }
}
