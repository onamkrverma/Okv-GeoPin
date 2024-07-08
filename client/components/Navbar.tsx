import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header className="bg-primary-800 rounded-xl border backdrop-blur-md border-primary-500">
      <nav className="flex items-center justify-between p-4">
        <div className="flex items-center gap-8">
          {/* logo */}
          <Link
            href="/"
            title="okv location"
            className="text-xl text-white font-bold"
          >
            Okv location
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
