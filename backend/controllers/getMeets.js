import User from "../models/user.js";
import Meet from "../models/meet.js";

export const getMeets = async (req, res) => {
    try {
        const { meet_ID } = req.params; // Extract from URL
        const { UID } = req.query; // Extract UID from query params

        // console.log("Received meet_ID:", meet_ID);
        // console.log("Received UID:", UID);

        if (!meet_ID) {
            return res.status(400).json({ message: "Meet ID is required" });
        }
        if (!UID) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find the user
        const user = await User.findById(UID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch the meeting
        const meet = await Meet.findOne({ meet_Id: String(meet_ID) })
             // Populate chat references

        if (!meet) {
            return res.status(404).json({ message: "Meet not found" });
        }

        // Check if the user is an attendee or if the meet is public
        // const isAttendee = meet.attendees.includes(user.email) || meet.meet_type === "public";
        // if (!isAttendee) {
        //     return res.status(403).json({ message: "You are not an attendee of this meet" });
        // }

        res.status(200).json({ meet });
        // console.log("Meet data sent to client:", meet);
    } catch (error) {
        console.error("Error in getMeet:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default getMeets;
