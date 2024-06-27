const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2
})

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US')

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount)
}

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US')

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number)
}

export function formatPositive(number: string | number) {
  const original = number

  if (typeof number === 'string') {
    const res = number.match(/[\.,0-9]+$/)

    if (res == null) return ''

    number = Number(res[0].replace(/\D/g, '').slice(0, -2))
  }
  return `${number > 0 ? '+' : ''}${original}`
}

export function formatChange(number: number, timespan: string) {
  return `${formatPositive(number)}% from last ${timespan}`
}

export function formatDate(date: string) {
  return DATE_FORMATTER.format(new Date(date))
}
