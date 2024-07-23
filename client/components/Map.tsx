import React from "react";
import LoadingIcon from "@/public/icons/loading.svg";

const Map = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  return (
    <div className="p-4 bg-neutral-800 my-4 border border-primary-500 rounded-xl min-h-80 relative">
      <span className="flex flex-col gap-2 items-center justify-center absolute top-0 left-0 w-full h-full  z-0">
        <LoadingIcon className="w-10 h-10" /> Map Loading...
      </span>
      <iframe
        title="google map"
        src={`https://maps.google.com/maps?q=@${latitude},${longitude}&z=25&output=embed`}
        width="100%"
        height="300"
        loading="lazy"
        style={{ border: "none", position: "relative", zIndex: 5 }}
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default Map;
