const socket = io("http://localhost:5000");

socket.on("connect", () => console.log("✅ Connected to WebSocket Server"));
socket.on("disconnect", () => console.log("❌ Disconnected from WebSocket Server"));

document.getElementById("sosButton").addEventListener("click", sendSOS);

function sendSOS() {
    if (!navigator.geolocation) {
        alert("⚠️ Geolocation not supported by your browser!");
        return;
    }

    navigator.geolocation.getCurrentPosition((pos) => {
        const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        console.log("📍 Sending SOS:", location);

        socket.emit("sos-alert", { message: "Help Needed!", location });

        fetch("http://localhost:5000/send-sos", { // Ensure correct URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ location }),
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(data => alert(data.message))
        .catch(err => console.error("❌ Error:", err));

    }, (error) => {
        console.error("❌ Location Error:", error);
        alert("⚠️ Location access denied or unavailable!");
    });
}

socket.on("alert-received", (data) => {
    console.log("🔔 SOS Alert Received:", data);
   
    const alertList = document.getElementById("alertList");
    const li = document.createElement("li");
    li.innerText = `${data.message} at Lat: ${data.location.lat}, Lng: ${data.location.lng}`;
    alertList.appendChild(li);
});
