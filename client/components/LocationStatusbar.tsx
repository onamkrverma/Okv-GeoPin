import React from "react";
import Chip from "./Chip";
import MapIcon from "@/public/icons/map.svg";
import MapOffIcon from "@/public/icons/map-off.svg";
import { GeolocationPosition, LocationStatus } from "@/app/global";

type Props = {
  locationStatus: LocationStatus;
  position: GeolocationPosition | null;
};

const LocationStatusbar = ({ locationStatus, position }: Props) => {
  return (
    <div className="flex gap-4 items-center justify-between flex-wrap">
      {locationStatus === "accessed" ? (
        <Chip
          label="location access"
          bgColor="bg-green-600"
          icon={<MapIcon className="w-6 h-6" />}
        />
      ) : (
        <Chip
          label="location denied"
          bgColor="bg-danger-600"
          icon={<MapOffIcon className="w-6 h-6" />}
        />
      )}

      {position ? (
        <div className="flex items-center gap-2">
          <p>longitude: {position.lng}</p>
          <p>latitue: {position.lat}</p>
        </div>
      ) : null}
    </div>
  );
};

export default LocationStatusbar;
