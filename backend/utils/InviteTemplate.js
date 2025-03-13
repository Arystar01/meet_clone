export const InviteTemplate = (content) => {
    const { chatLink = "#", meetLink = "#", title = "No Title", displayName = "User", email = "Not Provided" } = content;
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            h1 {
                color: #333333;
            }
            p {
                color: #555555;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                margin: 10px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
            }
            .chat-button {
                background-color: #28a745;
            }
            @media (max-width: 600px) {
                .container {
                    width: 90%;
                    padding: 15px;
                }
                .button {
                    width: 100%;
                    display: block;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to the Meet</h1>
            <p>Hello ${displayName},</p>
            <p>You are invited to join the meet titled <strong>${title}</strong>.</p>
            <p>Please click the button below to join the meet.</p>
            <a href="${meetLink}" class="button">Join Meet</a>
            <a href="${chatLink}" class="button chat-button">Open Chat</a>
            <p>If you have any questions or need assistance, please feel free to reach out to us.</p>
            <p>Best regards,<br>The Meet Team</p>
        </div>
    </body>
    </html>
    `;
};
