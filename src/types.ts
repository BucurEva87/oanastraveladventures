export type CountryGivenFromAPI = {
  name: {
    common?: string
    official: string
  }
  flag: string
  cca2: string
}

export type CountryFromAPI = {
  name: string
  flag: string
  code: string
}

export type SectorGivenFromAPI = {
	nume: string
	auto: string
}

export type SectorFromAPI = {
  name: string
  auto: string
}

export type CityGivenFromAPI = {
  nume: string
  simplu?: string
  comuna?: string
}

export type CityFromAPI = {
  name: string
  commune: string
}

export type CoordFromAPI = [
  number | null,
  number | null
]
