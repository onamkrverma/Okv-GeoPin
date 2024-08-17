import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "./socketContex";
import Navbar from "@/components/Navbar";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Okv GeoPin",
  description:
    "Discover Okv-GeoPin, the ultimate geolocation app to pin and share your favorite locations on a map. Enhance your location-sharing experience today!",

  metadataBase: new URL("https://okv-geopin.vercel.app/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Okv GeoPin",
    description:
      "Discover Okv-GeoPin, the ultimate geolocation app to pin and share your favorite locations on a map. Enhance your location-sharing experience today!",
    siteName: "Okv GeoPin",
    images: [
      {
        url: "/icons/map.svg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SocketProvider>
        <body className={inter.className}>
          <main className="container">
            <Navbar />
            {children}
          </main>
        </body>
      </SocketProvider>
    </html>
  );
}
