import React, { useState, useEffect } from 'react';
import QRCode from "react-qr-code";
import io from "socket.io-client";
import { Link, useNavigate } from 'react-router-dom';
import './Generate.css'; 

const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://wwebfrontback.onrender.com";
const socket = io(backendUrl);

const Generate = () => {
    const [session, setSession] = useState("");
    const [qrcode, setQrCode] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Hook to navigate programmatically

    useEffect(() => {
        // Emit connected event when component mounts
        socket.emit("connected", "Hello from imad");

        // Listen for QR code event
        socket.on("qr", (data) => {
            console.log("QR code received:", data.qr);
            setQrCode(data.qr);
            setLoading(false); // Stop loading when QR code is received
        });

        // Listen for ready event
        socket.on("ready", (data) => {
            console.log("Session is ready:", data);
            navigate('/message'); // Navigate to the Message component
        });

        // Listen for hello event
        socket.on("hello", (message) => {
            console.log(message);
        });

        // Cleanup event listeners when component unmounts
        return () => {
            socket.off("qr");
            socket.off("hello");
            socket.off("ready");
        };
    }, [navigate]);

    const createSessionForWhatsapp = () => {
        if (!session.trim()) {
            alert("Please enter a session ID.");
            return;
        }
        
        setLoading(true); // Start loading when session is created
        socket.emit("createSession", {
            id: session.trim(), // Emit the session ID to create a new session
        });
    };

    return (
        <div className='APP'>
            <h1>Open Whatsapp and Scan QR Code</h1>
            <div className="input-container">
                <input 
                    type='text' 
                    value={session} 
                    onChange={(e) => setSession(e.target.value)} 
                    placeholder="Enter session ID"
                    className="input-field"
                />
                <div className='buttons'>
                    <button onClick={createSessionForWhatsapp} className="create-button">Create Session</button>
                    <Link to={"/message"}><button className='create-button1'>Existing session</button></Link>
                </div>
            </div>
            <h1>QR code</h1>
            {loading ? <div className="spinner"></div> : qrcode && <QRCode value={qrcode} />}
        </div>
    )
}

export default Generate;
