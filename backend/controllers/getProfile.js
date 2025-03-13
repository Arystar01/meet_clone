import User from "../models/user.js"; 
export const getProfile = async (req, res) => {
    try {
        const { UID } = req.body;
        const user = await User.findById(UID);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        // if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ UID: user._id, username: user.username, email: user.email, profilePic: user.profilePic });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Invalild email or password" });
    }
}

export default getProfile;