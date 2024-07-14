"use client"

import { Button } from "../ui/button"

const PurchaseRouteButton = () => {
  return (
    <Button
      type="button"
      onClick={() => alert("Will be purchased")}
    >
      Purchase
    </Button>
  )
}
export default PurchaseRouteButton
