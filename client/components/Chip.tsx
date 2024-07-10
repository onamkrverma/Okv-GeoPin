import React from "react";

type Props = {
  label: string | undefined;
  icon?: React.ReactElement;
  bgColor?: string;
};

const Chip = ({ label, icon, bgColor }: Props) => {
  return (
    <div
      className={`flex gap-2 items-center ${
        bgColor ? `${bgColor}` : "bg-primary-800"
      } p-2 rounded-lg`}
    >
      {icon ? icon : null}
      <small className="capitalize">{label}</small>
    </div>
  );
};

export default Chip;
