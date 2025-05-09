import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load environment variables

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const myPhoneNumber = process.env.MY_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// ✅ Function to Send SOS Alert via Twilio
export function sendSOS(location) {
    const message = `🚨 SOS Alert! 🚨\nLocation: ${location.lat}, ${location.lng}\nPlease take immediate action!`;

    client.messages
    .create({
        body: message,
        from: twilioPhoneNumber,
        to: myPhoneNumber
    })
    .then(msg => console.log(`✅ SOS Sent! Message SID: ${msg.sid}`))
    .catch(err => console.error("❌ Error sending SOS:", err));
}
