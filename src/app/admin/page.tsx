import { data as dataCards } from "../../../data/cards"
import { data as dataChart } from "../../../data/chart"
import { data as dataSales } from "../../../data/sales"
import {
  formatChange,
  formatCurrency,
  formatNumber,
  formatPositive,
} from "@/lib/formatters"
import Card, { CardContent } from "./_components/Card"
import PageTitle from "../../components/PageTitle"
import BarChart from "./_components/BarChart"
import SalesCard from "./_components/SalesCard"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Dashboard" />

      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {dataCards.map((card, index) => (
          <Card
            key={index}
            label={card.label}
            description={formatChange(card.change, card.timespan)}
            amount={
              card.currency
                ? formatCurrency(card.amount)
                : formatNumber(card.amount)
            }
            icon={card.icon}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-2">
        <CardContent>
          <p className="p-4 font-semibold">Overview</p>

          <BarChart data={dataChart} />
        </CardContent>
        <CardContent className="flex justify-between gap-4">
          <section>
            <p>Recent Sales</p>
            <p className="text-sm text-gray-400">
              You made {dataSales.length} sales this mounth
            </p>
          </section>
          {dataSales.map((sale, index) => (
            <SalesCard
              key={index}
              email={sale.email}
              name={sale.name}
              amount={formatPositive(formatCurrency(sale.amount))}
            />
          ))}
        </CardContent>
      </section>
    </div>
  )
}
