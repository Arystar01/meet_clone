import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signinController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const validUser = await User.findOne({ email });
        if (!validUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(password, validUser.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Creating a token
        const token = jwt.sign(
            { id: validUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Defining inProduction variable properly
        const inProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days expiry for the cookie
            sameSite: "none",
            secure: inProduction,
        });

        res.status(200).json({
            message: "Signin successful",
            UID: validUser._id,
            username: validUser.username,
            email: validUser.email,
        });

    } catch (error) {
        console.error("Signin Error:", error);
        return res.status(500).json({ message: "Unable to signin. Please try again later." });
    }
};

export default signinController;
