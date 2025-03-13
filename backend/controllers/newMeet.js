import Meet from '../models/meet.js';
import User from '../models/user.js';
import { generateMeetID } from '../utils/generateMeetID.js';
import { InviteTemplate } from '../utils/InviteTemplate.js';
import sendEmail from '../utils/sendEmail.js';
import { createEvent } from 'ics';

export const newMeet = async (req, res) => {
    try {
        const { title, attendees = [], host_id, meet_type, caption, time } = req.body;

        const validUser = await User.findById(host_id);
        if (!validUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const meetID = generateMeetID();

        const meet = await Meet.create({
            title,
            attendees,
            host_id,
            meet_type,
            caption: caption || "Default caption",
            time,
            meet_Id: meetID
        });

        await meet.save();

        if (Array.isArray(attendees) && attendees.length > 0) {
            const now = new Date(time);
            const hostedURL = process.env.BASE_URL || "http://localhost:3000/api/user"; // Use env variable

            const chatLink = `${hostedURL}/chat/${meetID}`;
            const meetLink = `${hostedURL}/getMeets/${meetID}`;

            // Creating an event
            const { error, value } = createEvent({
                title: title || "Welcome to the meet",
                description: caption || "This is a default caption",
                start: [
                    now.getFullYear(), now.getMonth() + 1, now.getDate(),
                    now.getHours(), now.getMinutes(), now.getSeconds(),
                ],
                url: meetLink,
                organizer: {
                    email: validUser.email,
                    name: validUser.name,
                },
                duration: {
                    minutes: 60,
                }
            });

            if (error) {
                console.error("Error creating event:", error);
            }

            const emailTemplate = InviteTemplate({
                chatLink,
                meetLink,
                title,
                displayName: validUser.name,
                email: validUser.email,
            });

            console.log("Sending emails to attendees:", attendees.join(", "));

            // **Fix: Use for...of to await each email properly**
            for (const email of attendees) {
                try {
                    await sendEmail(validUser.email, email, "Invitation Message", emailTemplate, {
                        icalEvent: {
                            filename: "invitation.ics",
                            method: "REQUEST",
                            content: value,
                        }
                    });
                } catch (error) {
                    console.error(`Error sending email to ${email}:`, error);
                }
            }
        }

        return res.status(201).json({ meet, message: "Meet created successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error in creating a meet" });
    }
};

export default newMeet;
