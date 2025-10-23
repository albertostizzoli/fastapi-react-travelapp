import { useState } from "react";

function ChatAI() {
    const [messages, setMessages] = useState([
        {
            role: "ai",
            text: "Ciao sono il tuo assistente AI. Come posso aiutarti?"
        }
    ]);

    const [input, setInput] = useState(""); // stato per l'input

    // Funzione per mandare i messaggi nella chat
    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", text: input };
        setMessages([...messages, userMessage]);

        // chiamo l'API al backend
        const res = await fetch(`http://127.0.0.1:8000/chats`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input, mode: "chat" })
        });

        const data = await res.json(); 

        const aiMessage = { role: "ai", text: data.response };
        setMessages((prev) => [...prev, aiMessage]);
        setInput("");
    };

    return (
        <div className="flex flex-col h-screen max-w-5xl mx-auto bg-transparent backdrop-blur-xl">
            {/* Chat messaggi */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 rounded-3xl border scrollbar">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`rounded-lg px-4 py-2 max-w-xs ${m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
                                }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-transparent border-t flex gap-2 rounded-3xl">
                <input
                    className="flex-1 border rounded-full px-3 py-2 focus:outline-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Scrivi un messaggio..."
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-full"
                    onClick={sendMessage}>
                    Invia
                </button>
            </div>
        </div>
    );
}

export default ChatAI;