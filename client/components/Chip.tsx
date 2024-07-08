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
      } p-3 rounded-lg`}
    >
      {icon ? icon : null}
      <p className="capitalize">{label}</p>
    </div>
  );
};

export default Chip;
