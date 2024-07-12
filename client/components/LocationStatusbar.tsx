import React from "react";
import Chip from "./Chip";
import MapIcon from "@/public/icons/map.svg";
import MapOffIcon from "@/public/icons/map-off.svg";
import ServerIcon from "@/public/icons/server.svg";
import ServerOffIcon from "@/public/icons/server-off.svg";
import LoadingIcon from "@/public/icons/loading.svg";
import {
  GeolocationPosition,
  LocationStatus,
  ServerStatus,
} from "@/app/global";

type Props = {
  locationStatus: LocationStatus;
  position: GeolocationPosition | null;
  serverStatus: ServerStatus;
};

const LocationStatusbar = ({
  locationStatus,
  position,
  serverStatus,
}: Props) => {
  return (
    <div className="flex gap-4 items-center justify-between flex-wrap">
      <div className=" flex items-center gap-2 flex-wrap">
        {locationStatus === "accessed" ? (
          <Chip
            label="location access"
            bgColor="bg-green-600"
            icon={<MapIcon className="w-4 h-4" />}
          />
        ) : (
          <Chip
            label="location denied"
            bgColor="bg-danger-600"
            icon={<MapOffIcon className="w-4 h-4" />}
          />
        )}

        {serverStatus === "connected" ? (
          <Chip
            label="Server connected"
            bgColor="bg-green-600"
            icon={<ServerIcon className="w-4 h-4" />}
          />
        ) : serverStatus === "connecting" ? (
          <Chip
            label="Server connecting.."
            bgColor="bg-yellow-600"
            icon={<LoadingIcon className="w-4 h-4" />}
          />
        ) : (
          <Chip
            label="Server disconnected"
            bgColor="bg-danger-600"
            icon={<ServerOffIcon className="w-4 h-4" />}
          />
        )}
      </div>

      {position ? (
        <div className="flex items-center gap-2">
          <p>latitude: {position.lat}</p> <p>longitude: {position.lng}</p>
        </div>
      ) : null}
    </div>
  );
};

export default LocationStatusbar;
