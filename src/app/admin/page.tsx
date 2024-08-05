import {
  formatChange,
  formatCurrency,
  formatNumber,
  formatPositive,
} from "@/lib/formatters"
import prisma from "@/prisma/client"
import { endOfYear, startOfYear } from "date-fns"
import { Activity, CreditCard, DollarSign, Users } from "lucide-react"
import BarChart from "./_components/BarChart"
import Card, { CardContent } from "./_components/Card"
import PageTitle from "./_components/PageTitle"
import SalesCard from "./_components/SalesCard"
import {
  calculatePercentageChange,
  generateMontlyChartData,
  getOrdersByTimePeriods,
} from "./ordersMethods"

export default async function DashboardPage() {
  const [orders, ordersThisYear] = await Promise.all([
    await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    }),
    await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfYear(new Date()),
          lte: endOfYear(new Date()),
        },
      },
    }),
  ])
  const { ordersThisMonth, ordersLastMonth, ordersThisHour, ordersLastHour } =
    getOrdersByTimePeriods(orders)
  const differenceMonth = calculatePercentageChange(
    ordersThisMonth,
    ordersLastMonth
  )
  const differenceHour = calculatePercentageChange(
    ordersThisHour,
    ordersLastHour
  )
  console.log({
    ordersThisMonth,
    ordersLastMonth,
    ordersThisHour,
    ordersLastHour,
    differenceMonth,
    differenceHour,
  })

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Dashboard" />

      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        <Card
          label="Total Revenue"
          description={formatChange(20.1, "month")}
          amount={formatCurrency(
            orders.reduce((acc, order) => acc + order.pricePaidInCents, 0) / 100
          )}
          icon={DollarSign}
        />
        <Card
          label="Subscriptions"
          description={formatChange(180.1, "month")}
          amount={formatNumber(0)}
          icon={Users}
        />
        <Card
          label="Sales"
          description={
            differenceMonth === Infinity
              ? "No orders last month to compare with"
              : formatChange(differenceMonth, "month")
          }
          amount={formatCurrency(
            ordersThisMonth.reduce(
              (acc, order) => acc + order.pricePaidInCents,
              0
            ) / 100
          )}
          icon={CreditCard}
        />
        <Card
          label="Active Now"
          description={
            differenceHour === Infinity
              ? "No orders last hour to compare with"
              : differenceHour > 0
              ? formatChange(differenceHour, "hour")
              : formatChange(Math.abs(differenceHour), "hour")
          }
          amount={formatNumber(ordersThisHour.length)}
          icon={Activity}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-2">
        <CardContent>
          <p className="p-4 font-semibold">Overview</p>

          <BarChart data={generateMontlyChartData(ordersThisYear)} />
        </CardContent>
        <CardContent className="flex gap-4">
          <section>
            <p>Recent Sales</p>
            <p className="text-sm text-gray-400">
              You made {ordersThisMonth.length} sales this mounth (last 5 shown)
            </p>
          </section>
          {ordersThisMonth
            .toReversed()
            .slice(0, 5)
            .map((order, index) => (
              <SalesCard
                key={index}
                name={order.user!.name!}
                email={order.userEmail}
                image={order.user!.image || undefined}
                amount={formatPositive(
                  formatCurrency(order.pricePaidInCents / 100)
                )}
              />
            ))}
        </CardContent>
      </section>
    </div>
  )
}
