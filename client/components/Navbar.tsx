import Link from "next/link";
import React from "react";
import MapIcon from "@/public/icons/map.svg";

const Navbar = () => {
  return (
    <header className="bg-primary-800 rounded-xl border backdrop-blur-md border-primary-500">
      <nav className="flex items-center justify-between p-4">
        <div className="flex items-center gap-8">
          {/* logo */}
          <Link
            href="/"
            title="Okv GeoPin"
            className="text-xl text-white font-bold"
          >
            <p className="flex gap-1 items-center">
              <MapIcon className="w-6 h-6" />
              Okv GeoPin
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
