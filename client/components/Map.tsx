import React from "react";

const Map = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  return (
    <div className="p-4 bg-neutral-800 my-4 border border-primary-500 rounded-xl">
      <iframe
        title="google map"
        src={`https://maps.google.com/maps?q=@${latitude},${longitude}&z=25&output=embed`}
        width="100%"
        height="300"
        loading="lazy"
        style={{ border: "none" }}
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default Map;
