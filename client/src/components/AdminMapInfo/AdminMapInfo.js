import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getBuoys } from "../../services/dataServiceBuoys";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png"; // Import marker icon image

const AdminMapInfo = () => {
   const [mapCenter, setMapCenter] = useState([43.6864586, 15.7091269]);
   const [buoys, setBuoys] = useState([]);

   useEffect(() => {
      // Fetch buoys data when the component mounts
      getBuoys()
         .then(data => {
            setBuoys(data);
         })
         .catch(error => {
            console.error("Error fetching buoys data:", error);
         });
   }, []);


   // Create custom marker icons for paid and unpaid buoys
   const paidMarker = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png", // Red marker icon
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
   });

   const unpaidMarker = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png", // Green marker icon
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
   });

   return (
      <div>
         <MapContainer
            center={mapCenter}
            zoom={17}
            style={{ height: "90vh", width: "90%" }}
         >
            <TileLayer
               url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {buoys.map(buoy => (
               <Marker
                  key={buoy.id}
                  position={[buoy.lat, buoy.lng]}
                  icon={buoy.isPaid ? paidMarker : unpaidMarker} // Use paidMarker for paid buoys and unpaidMarker for unpaid buoys
               >
                  <Popup>Buoy: {buoy.qrData}.</Popup>
               </Marker>
            ))}
         </MapContainer>
      </div>
   );
};

export default AdminMapInfo;
