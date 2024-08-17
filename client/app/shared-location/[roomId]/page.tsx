"use client";
import Map from "@/components/Map";
import React, { useEffect, useState } from "react";
import { GeolocationPosition } from "../../global";
import { useParams } from "next/navigation";
import { useSocket } from "@/app/socketContex";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";

type RoomStatus = "unknown" | "joined" | "not-exist";

const SharedLocation = () => {
  useEffect(() => {
    document.title = "Shared Location | Okv GeoPin";
  }, []);

  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;
  const { socket, connectSocket } = useSocket();
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [roomStatus, setRoomStatus] = useState<RoomStatus>("unknown");

  useEffect(() => {
    connectSocket();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        socket.emit("joinRoom", {
          roomId,
        });
      });

      socket.on("roomJoined", ({ status }: { status: string }) => {
        if (status === "OK") {
          setRoomStatus("joined");
          toast.success("your can see live location of user");
        } else if (status === "ERROR") {
          setRoomStatus("not-exist");
          toast.error("Not found any live locaion on this link");
          setStatusMessage("Not found any live locaion on this link");
        } else {
          setRoomStatus("unknown");
          console.log("unknown error");
        }
      });

      socket.on(
        "updateLocationResponse",
        ({ position }: { position: GeolocationPosition }) => {
          if (position) {
            setPosition(position);
          }
        }
      );

      socket.on("roomDestroyed", () => {
        // console.log("roomDestroyed");
        setStatusMessage("User disabled location sharing");
        setRoomStatus("not-exist");
        socket.disconnect();
      });
      socket.on("disconnect", () => {
        // console.log("disconnected");
        toast.info("disconnected");
      });
    }
  }, [socket]);

  return (
    <div className="flex flex-col gap-2 my-10">
      <ToastContainer />

      {roomStatus === "joined" && position ? (
        <div className="flex flex-col gap-2">
          <h2 className="text-xl">User live location</h2>
          <Map latitude={position.lat} longitude={position.lng} />
        </div>
      ) : null}

      <div className="flex flex-col gap-2 items-center">
        <p className="text-center">{statusMessage}</p>

        <span className="text-sm text-center text-primary-400">
          Go back home and try to share your location with people
        </span>
        <Link
          href={"/"}
          title="Home"
          className="bg-primary-800 p-2 px-4 rounded-lg hover:bg-primary-700"
        >
          Home
        </Link>
      </div>
    </div>
  );
};

export default SharedLocation;
