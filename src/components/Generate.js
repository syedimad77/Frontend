import React, { useState, useEffect } from 'react';
import QRCode from "react-qr-code";
import io from "socket.io-client";
import { Link, useNavigate } from 'react-router-dom';
import './Generate.css'; 

const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://wwebfrontback.onrender.com";
const socket = io(backendUrl, {
    transports: ['websocket'], // Ensure WebSocket transport is used
    withCredentials: true
});

const Generate = () => {
    const [session, setSession] = useState("");
    const [qrcode, setQrCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [authenticating, setAuthenticating] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (authenticating) {
                setError("Authentication is taking too long. Please try again.");
                setAuthenticating(false);
                setLoading(false);
            }
        }, 60000); // 60 seconds timeout

        socket.emit("connected", "Hello from imad");

        socket.on("qr", (data) => {
            console.log("QR code received:", data.qr);
            setQrCode(data.qr);
            setLoading(false);
            setAuthenticating(true);
        });

        socket.on("ready", (data) => {
            console.log("Session is ready:", data);
            setAuthenticating(false);
            clearTimeout(timeout); // Clear timeout if ready event is received in time
            navigate('/message');
        });

        socket.on("hello", (message) => {
            console.log(message);
        });

        socket.on("error", (error) => {
            console.error("Socket error:", error);
            setError(error.message || "An error occurred.");
            setLoading(false);
            setAuthenticating(false);
        });

        return () => {
            socket.off("qr");
            socket.off("hello");
            socket.off("ready");
            socket.off("error");
            clearTimeout(timeout);
        };
    }, [navigate, authenticating]);

    const createSessionForWhatsapp = () => {
        if (!session.trim()) {
            alert("Please enter a session ID.");
            return;
        }
        
        setLoading(true);
        setError("");
        socket.emit("createSession", {
            id: session.trim(),
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
            {loading && <div className="spinner">Loading...</div>}
            {qrcode && !loading && <QRCode value={qrcode} />}
            {authenticating && <div>Authenticating, please wait...</div>}
            {error && <div className="error">{error}</div>}
        </div>
    )
}

export default Generate;
