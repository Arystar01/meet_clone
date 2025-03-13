import Meet from "../models/meet.js";
import User from "../models/user.js";

export const getAllMeets = async (req, res) => {
  try {
    const { UID } = req.body;

    // Find user by ID
    const user = await User.findById(UID);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Fetch meets where user is either host or attendee
    const meets = await Meet.find({
      $or: [{ host_id: UID }, { attendees: user.email }], // Fixed typo
    })
      .populate({
        path: "chats",
        options: { limit: 1, sort: { createdAt: -1 } },
      })
      .select("title caption meet_type host_id date_of_creation chats");

    return res.status(200).json({ success: true, meets });
  } catch (error) {
    console.error("Error in getAllMeets:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error in getAllMeets" });
  }
};

export default getAllMeets;
