import React from 'react'
import './CSS/Map.css'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { showDataOnMap } from './utility';


function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }

function Map({ countries, casesType, center, zoom }) {
    return (
        <div className='map'>
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={false}>
                <ChangeView center={center} zoom={zoom}/>
                <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {showDataOnMap(countries, casesType)}
            </MapContainer>
        </div>
    )
}

export default Map

