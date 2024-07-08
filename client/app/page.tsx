"use client";
import { useEffect, useState } from "react";
import { useSocket } from "./socketContex";
import LocationStatusbar from "@/components/LocationStatusbar";
import { GeolocationPosition, LocationStatus } from "./global";
import Map from "@/components/Map";

export default function Home() {
  const { socket, connectSocket } = useSocket();
  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("unknown");
  const [position, setPosition] = useState<GeolocationPosition | null>(null);

  useEffect(() => {
    let watchId: number | null = null;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus("accessed");
      });
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationStatus("accessed");
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationStatus("denied");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationStatus("unknown");
              break;
            case error.TIMEOUT:
              setLocationStatus("unknown");
              break;
            default:
              setLocationStatus("error");
              break;
          }
        }
      );
      return () => {
        if (watchId) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    }
  }, []);

  return (
    <div className="flex flex-col gap-2 my-6">
      <LocationStatusbar locationStatus={locationStatus} position={position} />

      {position ? (
        <Map latitude={position.lat} longitude={position.lng} />
      ) : null}
    </div>
  );
}
