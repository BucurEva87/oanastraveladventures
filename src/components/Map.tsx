"use client"

import L, { LatLngExpression, PointExpression } from "leaflet"
import { StaticImageData } from "next/image"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import MarkerIcon from "../../leaflet/images/marker.png"
import "../../leaflet/map.css"
import MapRecenterAutomatically from "./MapRecenterAutomatically"

const Map = (props: Props) => {
  return (
    <div>
      <MapContainer
        style={{
          width: "clamp(150px, 52vw, 800px)",
          height: "300px",
        }}
        center={props.center}
        zoom={props.zoom || 13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {props.markers?.map((marker, index) => (
          <Marker
            key={index}
            icon={
              new L.Icon({
                iconUrl: marker.icon?.icon?.src || MarkerIcon.src,
                iconRetinaUrl: marker.icon?.icon?.src || MarkerIcon.src,
                iconSize: marker.icon?.size || [32, 32],
                iconAnchor: marker.icon?.anchor || [12.5, 41],
                popupAnchor: marker.popup?.anchor || [0, -41],
              })
            }
            position={marker.position}
          >
            <Popup>{marker.popup.text}</Popup>
          </Marker>
        ))}
        <MapRecenterAutomatically center={props.center} />
      </MapContainer>
    </div>
  )
}

type Props = {
  center: LatLngExpression
  zoom?: number
  markers?: {
    icon?: {
      icon?: StaticImageData
      size?: PointExpression | undefined
      anchor?: PointExpression | undefined
    }
    popup: {
      anchor?: PointExpression | undefined
      text: string
    }
    position: LatLngExpression
  }[]
}

export default Map
