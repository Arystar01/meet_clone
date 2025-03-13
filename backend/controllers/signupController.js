import User from "../models/user.js";
import bcrypt from "bcrypt";

export const signupController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(200).json({
            message: "User created successfully",
            UID: newUser._id,
            username: newUser.username,
            email: newUser.email
        })

    } catch (error) {
        return res.status(201).json({
            message: "Unable to create user",
            error: error
        })
    }
}

export default signupController;