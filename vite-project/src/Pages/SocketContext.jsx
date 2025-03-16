import { createContext, useState, useRef, useEffect } from "react";
import React from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();
const socket = io("http://localhost:3000");

const ContextProvider = ({ children }) => {
    const [stream, setStream] = useState();
    const [me, setMe] = useState();
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");
    const myVideo = useRef(null);  // Initialize with null
const userVideo = useRef(null); // Initialize with null

    const connectionRef = useRef(null);
    const peerConnectionRef = useRef(); // to hold the peer connection

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video:{ facingMode: "user" }, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream; // Assign stream only if myVideo is defined
                }
                // console.log(currentStream);
            })
            .catch((err) => {
                console.error("Error accessing media devices:", err);
                alert("Could not access media devices.");
            });
    
        socket.on("me", (id) => setMe(id));
    
        socket.on("callUser", ({ from, name: CallerName, signal }) => {
            setCall({ isReceivedCall: true, from, name: CallerName, signal });
        });
    
        // Handle ICE candidates from other peers
        socket.on("iceCandidate", (candidate) => {
            if (connectionRef.current) {
                connectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });
    
        return () => {
            socket.off("me");
            socket.off("callUser");
            socket.off("iceCandidate");
        };
    }, []);
    

    // Create a new peer connection with WebRTC APIs
    const createPeerConnection = (isInitiator, stream) => {
        const configuration = {
            iceServers: [
                {
                    'url': 'stun:stun.l.google.com:19302'
                  },
                  {
                    'url': 'turn:192.158.29.39:3478?transport=udp',
                    'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                    'username': '28224511:1379330808'
                  },
                  {
                    'url': 'turn:192.158.29.39:3478?transport=tcp',
                    'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                    'username': '28224511:1379330808'
                  }
            ],
        };

        const peerConnection = new RTCPeerConnection(configuration);

        // Add the local stream to the peer connection
        stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

        // Handle ICE candidate events
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("iceCandidate", {
                    candidate: event.candidate,
                    to: call.from,
                });
            }
        };

        // Handle remote stream when it's added
        peerConnection.ontrack = (event) => {
            userVideo.current.srcObject = event.streams[0];
        };

        return peerConnection;
    };

    // Answer a call by creating a connection
    const answerCall = () => {
        setCallAccepted(true);

        const peerConnection = createPeerConnection(false, stream);
        peerConnection.setRemoteDescription(new RTCSessionDescription(call.signal));

        peerConnection
            .createAnswer()
            .then((answer) => {
                peerConnection.setLocalDescription(answer);
                socket.emit("answerCall", { signal: answer, to: call.from });
            })
            .catch((err) => console.error("Error creating answer: ", err));

        connectionRef.current = peerConnection;
        peerConnectionRef.current = peerConnection;
    };

    // Start a call by creating a connection
    const callUser = (id) => {
        const peerConnection = createPeerConnection(true, stream);

        peerConnection
            .createOffer()
            .then((offer) => {
                return peerConnection.setLocalDescription(offer);
            })
            .then(() => {
                socket.emit("callUser", { from: me, signalData: peerConnection.localDescription, userToCall: id, name: name });
            })
            .catch((err) => console.error("Error creating offer: ", err));

        socket.on("callaccepted", (signal) => {
            setCallAccepted(true);
            peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
        });

        connectionRef.current = peerConnection;
        peerConnectionRef.current = peerConnection;
    };

    // Leave the call and cleanup
    const leaveCall = () => {
        setCallEnded(true);
        peerConnectionRef.current.close();
        setStream(null); // Stop the local stream
        setCall(null); // Reset the call state
        setCallAccepted(false);
        setCallEnded(false);
    };

    return (
        <SocketContext.Provider value={{
            call,
            callAccepted,
            callEnded,
            name,
            setName,
            leaveCall,
            callUser,
            answerCall,
            stream,
            setStream,
            myVideo,
            userVideo,
            setCall,
            setCallAccepted,
            setCallEnded,
            me
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
