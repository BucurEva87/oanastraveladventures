import { Activity, CreditCard, DollarSign, LucideIcon, Users } from "lucide-react";

export const data: CardData[] = [
  {
    label: "Total Revenue",
    change: 20.1,
    amount: 45234.89,
    icon: DollarSign,
    currency: true,
    timespan: 'month'
  },
  {
    label: "Subscriptions",
    change: 180.1,
    amount: 2350,
    icon: Users,
    timespan: 'month'
  },
  {
    label: "Sales",
    change: 19,
    amount: 12234,
    icon: CreditCard,
    currency: true,
    timespan: 'month'
  },
  {
    label: "Active Now",
    change: 201,
    amount: 573,
    icon: Activity,
    timespan: 'hour'
  }
]

type CardData = {
  label: string
  change: number
  amount: number
  icon: LucideIcon
  currency?: boolean
  timespan: string
}
