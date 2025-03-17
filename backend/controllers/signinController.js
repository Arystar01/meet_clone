import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Cookies from "cookies";
dotenv.config();

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

        // Create a JWT token
        const token = jwt.sign(
            { id: validUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        console.log("Generated token:", token);

        // Set secure to false in development
        const secure = true; // In development, we don't need HTTPS (use for local development)

        // Set the cookie in the response
        res.cookie("token", token, {
            httpOnly: true,  // Prevents JavaScript from accessing the cookie
            maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie expiration: 7 days
            sameSite: "None", // Required for cross-origin cookies
            secure,  // Always set to false in development (no HTTPS)
        });

        console.log("Cookie set:", token); // Log the token if needed (useful for debugging)

        // Respond with user info and success message
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
