import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function wait(duration: number) {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}

export const noDia = (string: string) => {
	return string
		.replace(/ă/gi, "a")
		.replace(/î/gi, "i")
		.replace(/â/gi, "a")
		.replace(/ș/gi, "s")
		.replace(/ț/gi, "t")
}

export const sortAsc = (key: string) => {
	return (a: {}, b: {}) => {
		const v1 = a[key as keyof typeof a]
		const v2 = b[key as keyof typeof b]

		if (v1 < v2) return -1
		if (v1 > v2) return 1
		return 0
	}
}

export const sortDesc = (key: string) => {
	return (a: {}, b: {}) => {
		const v1 = a[key as keyof typeof a]
		const v2 = b[key as keyof typeof b]

		if (v1 > v2) return -1
		if (v1 > v2) return 1
		return 0
	}
}

export const convertDMSToDD = (dms: string) => {
	const regex = /([\d\.]+)°([\d\.]+)[′']([\d\.]+)[″"]([NSEW])/
	const matches = dms.match(regex)

	if (!matches || matches.length !== 5)
		return parseFloat(dms) || null

	const degrees = parseFloat(matches[1])
	const minutes = parseFloat(matches[2])
	const seconds = parseFloat(matches[3])
	const direction = matches[4]

	let dd = degrees + minutes / 60 + seconds / 3600

	if (direction === "S" || direction === "W")
		dd = -dd

	return dd
}

export const calculateDistanceBetweenLocations = (
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
) => {
	function toRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

	const R = 6371
	const dLat = toRadians(lat2 - lat1)
	const dLon = toRadians(lon2 - lon1)
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRadians(lat1)) *
			Math.cos(toRadians(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2)
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
	const distance = R * c

	return distance
}

export const calculateRouteLength = (locations: { latitude: number | null, longitude: number | null }[], circular: boolean) => {
	if (locations.length < 2) return 0

	let length = 0

	if (circular) locations = [...locations, locations[0]]

	for (let i = 0; i < locations.length - 1; i++) {
		const [lat1, lon1] = [locations[i].latitude, locations[i].longitude]
		const [lat2, lon2] = [
			locations[i + 1].latitude,
			locations[i + 1].longitude,
		]

		if (!lat1 || !lon1 || !lat2 || !lon2) continue

		const distance = calculateDistanceBetweenLocations(
			lat1,
			lon1,
			lat2,
			lon2
		)

		length += distance
	}

	return Number(length.toFixed(2))
}

export const capitalize = (string: string) => {
	return `${string[0].toUpperCase()}${string.substring(1)}`
}

export const manageDistance = (distance: number, metric: string) => {
	return metric === 'km' ? distance.toFixed(2) : (distance * 0.621371).toFixed(2)
}

export const getImagePublicId = (images: string[]): string[] => {
	return images.map(src => src.split('/').at(-1)!.split('.')[0])
}
