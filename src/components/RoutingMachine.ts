import L, { ControlOptions, LatLng, LatLngExpression } from 'leaflet'
import { createControlComponent } from '@react-leaflet/core'
import 'leaflet-routing-machine'

const createRoutingMachineLayer = (props: RoutingMachineProps) => {
  const waypoints: LatLng[] = props.waypoints.map((wp) => L.latLng(wp))

  const instance = L.Routing.control({
    waypoints,
    lineOptions: {
      styles: [{ color: '#6FA1EC', weight: 4 }],
      extendToWaypoints: true,
      missingRouteTolerance: 0
    },
    show: false,
    addWaypoints: false,
    routeWhileDragging: true,
    fitSelectedRoutes: true,
    showAlternatives: false
  })

  return instance
}

const RoutingMachine = createControlComponent(createRoutingMachineLayer)

interface RoutingMachineProps extends ControlOptions {
  waypoints: LatLngExpression[]
}

export default RoutingMachine
