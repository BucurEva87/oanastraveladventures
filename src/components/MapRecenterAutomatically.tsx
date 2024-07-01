import { LatLngExpression } from "leaflet"
import { useEffect } from "react"
import { useMap } from "react-leaflet"

const MapRecenterAutomatically = ({ center }: Props) => {
  const map = useMap()

  useEffect(() => {
    map.setView(center)
  }, [map, center])

  return <div>MapRecenterAutomatically</div>
}

type Props = {
  center: LatLngExpression
}

export default MapRecenterAutomatically
