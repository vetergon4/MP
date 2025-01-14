import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import "leaflet-velocity";

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const AdminWindInfo = () => {
    const [windData, setWindData] = useState(null);
    const latitude = 43.6864586;
    const longitude = 15.7091269;

    useEffect(() => {
        const fetchWindData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/weather/wind`, {
                    params: {
                        latitude: latitude,
                        longitude: longitude,
                    },
                });
                console.log(response.data); // Log the wind data
                setWindData(response.data);
            } catch (error) {
                console.error("Error fetching wind data:", error);
            }
        };

        fetchWindData();
    }, [latitude, longitude]);

    return (
        <div>
            <MapContainer
                center={[latitude, longitude]}
                zoom={17}
                style={{ height: "90vh", width: "90%" }}
            >
                <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {windData && <WindLayer windData={windData} latitude={latitude} longitude={longitude} />}
            </MapContainer>
        </div>
    );
};

const WindLayer = ({ windData, latitude, longitude }) => {
    const map = useMap();

    useEffect(() => {
        if (windData) {
            const rows = 10; // Further reduce the number of rows for the grid
            const cols = 10; // Further reduce the number of columns for the grid
            const uComponent = Array(rows).fill(null).map(() => Array(cols).fill(0));
            const vComponent = Array(rows).fill(null).map(() => Array(cols).fill(0));

            const latStep = (map.getBounds().getNorth() - map.getBounds().getSouth()) / rows;
            const lonStep = (map.getBounds().getEast() - map.getBounds().getWest()) / cols;

            // Convert wind data to the structure required by leaflet-velocity
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const lat = map.getBounds().getSouth() + i * latStep;
                    const lon = map.getBounds().getWest() + j * lonStep;
                    const index = Math.floor((i * cols + j) % windData.hourly.time.length);
                    const windSpeed = windData.hourly.wind_speed_10m[index];
                    const windDirection = windData.hourly.wind_direction_10m[index];
                    const u = windSpeed * Math.cos(windDirection * Math.PI / 180);
                    const v = windSpeed * Math.sin(windDirection * Math.PI / 180);
                    uComponent[i][j] = u;
                    vComponent[i][j] = v;
                }
            }

            const velocityData = [
                {
                    header: {
                        parameterCategory: 2,
                        parameterUnit: "m.s-1",
                        parameterNumber: 2,
                        dx: lonStep,
                        dy: latStep,
                        la1: map.getBounds().getNorth(),
                        lo1: map.getBounds().getWest(),
                        nx: cols,
                        ny: rows,
                    },
                    data: uComponent.flat(),
                },
                {
                    header: {
                        parameterCategory: 2,
                        parameterNumber: 3,
                        parameterUnit: "m.s-1",
                        dx: lonStep,
                        dy: latStep,
                        la1: map.getBounds().getNorth(),
                        lo1: map.getBounds().getWest(),
                        nx: cols,
                        ny: rows,
                    },
                    data: vComponent.flat(),
                },
            ];

            const velocityLayer = L.velocityLayer({
                displayValues: true,
                displayOptions: {
                    velocityType: "GBR Wind",
                    displayPosition: "bottomleft",
                    displayEmptyString: "No wind data",
                },
                data: velocityData,
                maxVelocity: 10,
            });

            velocityLayer.addTo(map);
        }
    }, [windData, map]);

    useEffect(() => {
        map.setView([latitude, longitude], 17); // Set zoom level to 17 as required
    }, [map, latitude, longitude]);

    return null;
};


export default AdminWindInfo;
