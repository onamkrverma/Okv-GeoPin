import React from "react";
import Chip from "./Chip";
import MapIcon from "@/public/icons/map.svg";
import MapOffIcon from "@/public/icons/map-off.svg";
import ServerIcon from "@/public/icons/server.svg";
import ServerOffIcon from "@/public/icons/server-off.svg";
import {
  GeolocationPosition,
  LocationStatus,
  SocketStatus,
} from "@/app/global";

type Props = {
  locationStatus: LocationStatus;
  position: GeolocationPosition | null;
  socketStatus: SocketStatus;
};

const LocationStatusbar = ({
  locationStatus,
  position,
  socketStatus,
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

        {socketStatus === "connected" ? (
          <Chip
            label="Server connected"
            bgColor="bg-green-600"
            icon={<ServerIcon className="w-4 h-4" />}
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
