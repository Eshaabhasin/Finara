import React, { useState } from "react";
import NavBar from "../NavBar/NavBar";

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        try {
            const response = await fetch("http://localhost:5000/api/learn", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();
            
            const botMessage = { text: data.message, sender: "bot" };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = { 
                text: "Sorry, there was an error connecting to the server.", 
                sender: "bot" 
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    const startListening = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Your browser does not support Speech Recognition.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = "en-US";

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript); 
        };

        recognition.start();
    };

    return (
        <>
        <NavBar></NavBar>
        <div className="min-h-screen px-10 flex flex-col">
            {/* Main Section */}
            <div className="mt-20 flex justify-between items-start">
                {/* Left Section - Talk Coach Text */}
                <div>
                <h1 className="text-8xl mt-10 font-extrabold tracking-wide">
                   Solace
                </h1>
                    <p className="text-gray-200 text-2xl font-bold mt-8">
                        Your personal AI-powered communication mentor. Whether it's <br />
                        public speaking, social conversations, or professional discussions, <br />
                        Talk Coach is here to help.
                    </p>
                </div>

                <div className="absolute right-5 bottom-8 backdrop-blur-sm bg-white/10 p-6 rounded-xl shadow-lg w-[500px] h-[600px] flex flex-col">
                    <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 flex flex-col" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <style jsx>{`
                            .scrollbar-hide::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg max-w-[75%] ${
                                    msg.sender === "user"
                                        ?" bg-green-500 text-white self-end text-right"
                                        : "bg-green-700 text-white self-start text-left"
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    {/* Input Field with SVG Icons for Mic and Send */}
                    <div className="mt-3 flex">
                        <input
                            type="text"
                            className="bg-transparent flex-1 border p-2 rounded-lg text-white"
                            placeholder="Type or speak your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                            onClick={startListening}
                            className={`ml-2 bg-green-500 text-white p-2 rounded-lg ${
                                isListening ? "opacity-50" : ""
                            }`}
                            disabled={isListening}
                        >
                            {/* Microphone Icon SVG */}
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="w-6 h-6"
                            >
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" y1="19" x2="12" y2="23" />
                                <line x1="8" y1="23" x2="16" y2="23" />
                            </svg>
                        </button>
                        <button
                            onClick={sendMessage}
                            className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
                        >
                            {/* Send Icon SVG */}
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="w-6 h-6"
                            >
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default Chatbot;


