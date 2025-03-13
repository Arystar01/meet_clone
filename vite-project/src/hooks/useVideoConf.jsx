import React, { useEffect, useRef } from "react";
import Peer from "peerjs";
import { useSocket } from "../hooks/useSocket";

export const useVideoConf = () => {
  const socketClient = useSocket();
  const peers = useRef({});
  const myStream = useRef(null);
  const peerStream = useRef(new Map());
  const peerJs = useRef(null);

  useEffect(() => {
    peerJs.current = new Peer({
      path: "/",
      host: "0.peerjs.com",
      port: 443,
    });

    peerJs.current.on("open", (id) => {
      socketClient.emit("join-room", { userID: id });
      getVideoAudioStream().then((stream) => {
        if (stream) {
          myStream.current = stream;
          setPeersListeners(stream);
        }
      });
    });

    return () => {
      peerJs.current?.destroy();
      socketClient.disconnect();
    };
  }, []);

  const getVideoAudioStream = () => {
    return navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  };

  const setPeersListeners = (stream) => {
    peerJs.current?.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (userVideoStream) => {
        peerStream.current.set(call.metadata.id, {
          stream: userVideoStream,
          displayName: call.metadata.displayName,
        });
      });
      call.on("close", () => {
        peerStream.current.delete(call.metadata.id);
      });
      peers.current[call.metadata.id] = call;
    });

    socketClient.on("user-connected", (userData) => {
      connectToNewUser(userData, stream);
    });
  };

  const connectToNewUser = (userData, stream) => {
    const { userID, displayName } = userData;
    const call = peerJs.current?.call(userID, stream, {
      metadata: { id: peerJs.current?.id, displayName },
    });

    call?.on("stream", (userVideoStream) => {
      peerStream.current.set(userID, {
        stream: userVideoStream,
        displayName,
      });
    });

    call?.on("close", () => {
      peerStream.current.delete(userID);
    });

    peers.current[userID] = call;
  };

  const raiseHand = () => {
    socketClient.emit("raiseHand");
  };

  const destroyConnection = () => {
    myStream.current?.getTracks().forEach((track) => track.stop());
    peerJs.current?.destroy();
    socketClient.disconnect();
    window.location.href = "/";
  };

  return {
    myStream,
    peerStream,
    destroyConnection,
    raiseHand,
  };
};
