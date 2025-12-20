import { useState, useRef, useEffect } from "react";
import api from "../api/axios";
import { MessageCircle, X, Send } from "lucide-react";

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: "Hi! I'm the Clinic AI. Ask me about opening hours, prices, or services." }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        try {
            const response = await api.post("analytics/chat/", { message: input });
            const botMsg = { sender: 'bot', text: response.data.response };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I can't connect right now." }]);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col transition-all transform origin-bottom-right">
                    <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                        <h3 className="font-bold">Virtual Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 rounded p-1">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-3">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-3 py-2 text-sm rounded-lg ${
                                    msg.sender === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-3 bg-white border-t flex space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 text-sm border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isOpen ? 'bg-gray-500' : 'bg-blue-600'} text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>
        </div>
    );
};

export default ChatWidget;