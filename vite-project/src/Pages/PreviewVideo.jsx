import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PreviewVideo = () => {
    const [stream, setStream] = useState(null);
    const [videoOn, setVideoOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [meetid, setMeetId] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [owner, setOwner] = useState("");

    const myVideo = useRef(null);
    const navigate = useNavigate();
    const meetStore = useSelector((state) => state.meetStore);

    useEffect(() => {
        if (meetStore) {
            setDate(meetStore.meet_date);
            setMeetId(meetStore.meet_id);
            setTitle(meetStore.meet_name);
            setDescription(meetStore.meet_description);
            setOwner(meetStore.meet_owner);
        }
    }, [meetStore]);

    useEffect(() => {
        let currentStream;
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((mediaStream) => {
                currentStream = mediaStream;
                setStream(mediaStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = mediaStream;
                }
            })
            .catch((err) => {
                console.error("Error accessing media devices:", err);
                alert("Could not access media devices.");
            });

        return () => {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const toggleVideo = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setVideoOn(videoTrack.enabled);
            }
        }
    };

    const toggleMic = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setMicOn(audioTrack.enabled);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-purple-200 p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Meeting Preview</h1>

            <div className="relative w-64 h-64 bg-black rounded-lg overflow-hidden shadow-lg">
                <video ref={myVideo} className="w-full h-full object-cover" autoPlay playsInline muted />
                {!videoOn && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <FaVideoSlash className="text-white text-5xl" />
                    </div>
                )}
            </div>

            <div className="mt-6 flex gap-4">
                <button
                    onClick={toggleVideo}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md transition text-white font-medium ${
                        videoOn ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                    }`}
                >
                    {videoOn ? <FaVideoSlash /> : <FaVideo />}
                    {videoOn ? "Turn Off Video" : "Turn On Video"}
                </button>

                <button
                    onClick={toggleMic}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md transition text-white font-medium ${
                        micOn ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                    }`}
                >
                    {micOn ? <FaMicrophoneSlash /> : <FaMicrophone />}
                    {micOn ? "Mute" : "Unmute"}
                </button>

                <button
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md transition text-white font-medium bg-red-600"
                    onClick={() => navigate('/getMeets/' + meetid, {state: { userMicon: micOn, userVideoon: videoOn}})}
                >
                    Join the meet
                </button>
            </div>

            <div className="mt-8 w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Meeting Details</h2>
                <div className="space-y-2">
                    <p className="text-gray-600"><strong>ID:</strong> {meetid || "Not Available"}</p>
                    <p className="text-gray-600"><strong>Title:</strong> {title || "No Title Provided"}</p>
                    <p className="text-gray-600"><strong>Description:</strong> {description || "No Description Available"}</p>
                    <p className="text-gray-600"><strong>Date:</strong> {date || "No Date Set"}</p>
                    <p className="text-gray-600"><strong>Owner:</strong> {owner || "Unknown"}</p>
                </div>
            </div>
        </div>
    );
};

export default PreviewVideo;
