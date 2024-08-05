import { Order as SchemaOrder, User } from "@prisma/client"
import { getMonth } from "date-fns"

function getCurrentMonthRange() {
  const now = new Date()
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
    0,
    0,
    0,
    0
  )
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  )

  return { startOfMonth, endOfMonth }
}

function getPreviousMonthRange() {
  const now = new Date()
  const startOfPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
    0,
    0,
    0,
    0
  )
  const endOfPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
    999
  )

  return { startOfPreviousMonth, endOfPreviousMonth }
}

function getCurrentHourRange() {
  const now = new Date()
  const startOfHour = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    0,
    0,
    0
  )
  const endOfHour = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    59,
    59,
    999
  )

  return { startOfHour, endOfHour }
}

function getPreviousHourRange() {
  const now = new Date()
  const startOfPreviousHour = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours() - 1,
    0,
    0,
    0
  )
  const endOfPreviousHour = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours() - 1,
    59,
    59,
    999
  )

  return { startOfPreviousHour, endOfPreviousHour }
}

function filterOrdersByDateRange(
  orders: Order[],
  startDate: Date,
  endDate: Date
) {
  return orders.filter((order) => {
    const createdAt = new Date(order.createdAt)
    return createdAt >= startDate && createdAt <= endDate
  })
}

export function getOrdersByTimePeriods(orders: Order[]) {
  const { startOfMonth, endOfMonth } = getCurrentMonthRange()
  const { startOfPreviousMonth, endOfPreviousMonth } = getPreviousMonthRange()
  const { startOfHour, endOfHour } = getCurrentHourRange()
  const { startOfPreviousHour, endOfPreviousHour } = getPreviousHourRange()

  const ordersThisMonth = filterOrdersByDateRange(
    orders,
    startOfMonth,
    endOfMonth
  )
  const ordersLastMonth = filterOrdersByDateRange(
    orders,
    startOfPreviousMonth,
    endOfPreviousMonth
  )
  const ordersThisHour = filterOrdersByDateRange(orders, startOfHour, endOfHour)
  const ordersLastHour = filterOrdersByDateRange(
    orders,
    startOfPreviousHour,
    endOfPreviousHour
  )

  return { ordersThisMonth, ordersLastMonth, ordersThisHour, ordersLastHour }
}

export function calculatePercentageChange(thisMonth: Order[], lastMonth: Order[]) {
  const ordersThisMonthCount = thisMonth.length
  const ordersLastMonthCount = lastMonth.length

  if (ordersLastMonthCount === 0)
    return Infinity

  return ((ordersThisMonthCount - ordersLastMonthCount) / ordersLastMonthCount) * 100
}

export function generateMontlyChartData(orders: Order[]): ChartData {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  const monthlyTotals = Array(12).fill(0)

  orders.forEach(order => {
    const monthIndex = getMonth(order.createdAt)

    monthlyTotals[monthIndex] += order.pricePaidInCents
  })

  const chartData: ChartData = months.map((month, index) => ({
    name: month,
    total: monthlyTotals[index] / 100
  }))

  return chartData
}

export type ChartData = {
  name: string
  total: number
}[]

type Order = SchemaOrder & {
  user?: Pick<User, 'name' | 'image'>
}
