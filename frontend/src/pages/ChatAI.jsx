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
        <div className="flex flex-col h-[85vh] sm:h-[80vh] md:h-[75vh] max-w-4xl mx-auto mt-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden px-8 sm:px-4 md:px-6">
            {/* Chat messaggi */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`px-5 py-3 rounded-2xl shadow-sm transition-all duration-300 max-w-[75%] ${m.role === "user"
                                ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-br-none"
                                : "bg-white/80 text-gray-900 backdrop-blur-md border border-gray-200 rounded-bl-none"
                                }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input area */}
            <div className="p-4 flex items-center gap-3">
                <input
                    className="flex-1 bg-white/20 border border-white/30 rounded-full px-4 py-3 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Scrivi un messaggio..."
                />
                <button
                    onClick={sendMessage}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-3 rounded-full font-medium shadow-lg transition-transform transform hover:scale-105">
                    Invia
                </button>
            </div>
        </div>
    );
}

export default ChatAI;