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
