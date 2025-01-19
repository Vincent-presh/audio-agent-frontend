import React, {useState, useRef} from "react";
import {createTask} from "../apis/createTask";
import {FaPaperclip, FaPaperPlane} from "react-icons/fa";

interface Message {
  type: "user" | "bot";
  content: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [clientId] = useState("example-client-id"); // Replace with actual client ID
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {type: "user", content: input};
    setMessages((prev) => [...prev, newMessage]);

    try {
      setLoading(true);

      // Call the createTask API
      const response = await createTask(clientId, input);

      const {description, chapters} = response.data;

      const botMessage: Message = {
        type: "bot",
        content: `Description: ${description}\nChapters: ${chapters.join(
          ", "
        )}`,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {type: "bot", content: "Sorry, something went wrong!"},
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newMessage: Message = {
        type: "user",
        content: `Uploaded file: ${file.name}`,
      };
      setMessages((prev) => [...prev, newMessage]);

      // Handle file upload if needed
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Video Processing ChatBot
      </h2>
      <div className="border border-gray-300 rounded-lg p-4 h-96 overflow-y-auto mb-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            } mb-3`}
          >
            <span
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <p className="text-center text-gray-500">Processing...</p>}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message or video URL"
          className="flex-grow border border-gray-300 rounded-lg p-2 mr-2"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaPaperclip size={24} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2 hover:bg-blue-600 disabled:bg-blue-300"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
