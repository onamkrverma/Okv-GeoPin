"use client";
import { useEffect, useState } from "react";
import { useSocket } from "./socketContex";
import LocationStatusbar from "@/components/LocationStatusbar";
import { GeolocationPosition, LocationStatus, SocketStatus } from "./global";
import Map from "@/components/Map";
import ClipboardIcon from "@/public/icons/clipboard.svg";
import { toast } from "react-toastify";

type RoomInfo = {
  roomId: string;
  position: GeolocationPosition;
  totalConnectedUsers: string[];
};

export default function Home() {
  const { socket, connectSocket } = useSocket();
  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("unknown");
  const [position, setPosition] = useState<GeolocationPosition | null>(null);

  const [socketStatus, setSocketStatus] =
    useState<SocketStatus>("disconnected");

  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);

  useEffect(() => {
    let watchId: number | null = null;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus("accessed");
      });
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationStatus("accessed");
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationStatus("denied");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationStatus("unknown");
              break;
            case error.TIMEOUT:
              setLocationStatus("unknown");
              break;
            default:
              setLocationStatus("error");
              break;
          }
        }
      );
      return () => {
        if (watchId) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    }
  }, []);

  const connectToSocketServer = () => {
    connectSocket();
    setSocketStatus("connecting");
  };

  const handleShareLocationStart = () => {
    if (locationStatus === "accessed") {
      connectToSocketServer();
    } else {
      toast.info("Please allow location access");
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setSocketStatus("connected");
        socket.emit("createRoom", {
          position,
        });
      });

      socket.on("roomCreated", (data: RoomInfo) => {
        toast.success("Your location is live now");
        setRoomInfo(data);
      });

      socket.on(
        "userJoinedRoom",
        (data: { userId: string; totalConnectedUsers: string[] }) => {
          setRoomInfo((prev) =>
            prev
              ? { ...prev, totalConnectedUsers: data.totalConnectedUsers }
              : null
          );

          toast.info(`${data.userId} can see your location"`);

          position
            ? socket.emit("updateLocation", {
                position,
              })
            : null;
        }
      );

      socket.on(
        "userLeftRoom",
        (data: { userId: string; totalConnectedUsers: string[] }) => {
          setRoomInfo((prev) =>
            prev
              ? { ...prev, totalConnectedUsers: data.totalConnectedUsers }
              : null
          );
          toast.info(`${data.userId} disconnected"`);
        }
      );

      socket.on("disconnect", () => {
        setSocketStatus("disconnected");
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.emit("updateLocation", { position });
    }
  }, [position]);

  const handleStopSharing = () => {
    if (socket) {
      socket.disconnect();
      setSocketStatus("disconnected");
      setRoomInfo(null);
      toast.info("You are no longer sharing location");
    }
  };

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareUrl = `${currentUrl}shared-location/${roomInfo?.roomId}`;

  const shareData = {
    title: "See my real time location on map",
    text: "See my real time location on map",
    url: shareUrl,
  };

  const shareLocationLink = async () => {
    try {
      if (socketStatus !== "connected") {
        throw Error("Turn on location sharing first!");
      }
      await navigator.share(shareData);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="flex flex-col gap-2 my-6">
      <LocationStatusbar
        locationStatus={locationStatus}
        position={position}
        socketStatus={socketStatus}
      />

      {position ? (
        <Map latitude={position.lat} longitude={position.lng} />
      ) : null}

      <div className="flex items-center justify-between">
        <div className="flex flex-grow flex-col">
          <p className="text-sm font-medium leading-6">Location Sharing</p>
          <span className="text-sm text-primary-400">
            Toggle this for turn on/off location sharing
          </span>
        </div>
        <button
          type="button"
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent ${
            socketStatus === "connected" ? "bg-indigo-600" : "bg-gray-200"
          } transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"`}
          onClick={
            socketStatus === "disconnected"
              ? handleShareLocationStart
              : handleStopSharing
          }
        >
          <span
            aria-hidden="true"
            className={`"pointer-events-none inline-block h-5 w-5 ${
              socketStatus === "connected" ? "translate-x-5" : "translate-x-0"
            } transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"`}
          ></span>
        </button>
      </div>

      <div className="flex flex-col gap-4 my-4 ">
        {roomInfo ? (
          <div className="flex flex-col gap-4">
            <code className="flex justify-between items-center flex-wrap bg-primary-800 p-2 px-4 rounded-md text-xs sm:text-base">
              {shareUrl}
              <span
                title="copy"
                className="cursor-pointer"
                onClick={handleCopy}
              >
                <ClipboardIcon className="w-6 h-6" />
              </span>
            </code>

            <p>
              {roomInfo.totalConnectedUsers.length - 1} user
              {roomInfo.totalConnectedUsers.length >= 1 ? "" : "s"}{" "}
              {roomInfo.totalConnectedUsers.length >= 1 ? "is" : "are"}{" "}
              monitoring your location
            </p>
          </div>
        ) : null}

        <button
          type="button"
          title="Share your location"
          className="w-44 bg-primary-800 p-2 rounded-lg hover:bg-primary-700"
          onClick={shareLocationLink}
        >
          Share Location
        </button>
      </div>
    </div>
  );
}
