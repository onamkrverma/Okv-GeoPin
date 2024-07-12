"use client";
import Map from "@/components/Map";
import React, { useEffect, useState } from "react";
import { GeolocationPosition } from "../../global";
import { useParams } from "next/navigation";
import { useSocket } from "@/app/socketContex";
import { toast } from "react-toastify";
import Link from "next/link";

const SharedLocation = () => {
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;
  const { socket, connectSocket } = useSocket();
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

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
          toast.success("your can see live location of user");
        } else if (status === "ERROR") {
          toast.error("Not found any live locaion on this link");
          setStatusMessage("Not found any live locaion on this link");
        } else {
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

      socket.on("roomDestoryed", () => {
        toast.info("Not found any live locaion on this link");
        setStatusMessage("Not found any live locaion on this link");
        socket.disconnect();
      });
      socket.on("disconnect", () => {
        toast.info("disconnected");
      });
    }
  }, [socket, roomId]);

  return (
    <div className="flex flex-col gap-2 my-10">
      {position ? (
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
