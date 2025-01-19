import React, {useState, useEffect, useRef} from "react";
import {createTask} from "../apis/createTask";
import {fetchClients} from "../apis/fetchClients";
import {
  subscribeToTaskUpdates,
  connectSocket,
  disconnectSocket,
  socketId,
} from "../services/socketService";
import {FaPaperclip, FaPaperPlane} from "react-icons/fa";

interface Message {
  type: "user" | "bot";
  content: string;
}

interface Client {
  _id: string;
  name: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getClients = async () => {
      try {
        const clientData = await fetchClients();
        setClients(clientData);
        if (clientData.length > 0) {
          setSelectedClient(clientData[0]._id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getClients();
  }, []);

  useEffect(() => {
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !selectedClient) return;

    const newMessage: Message = {type: "user", content: input};
    setMessages((prev) => [...prev, newMessage]);

    try {
      setLoading(true);
      console.log(
        "🚀 ~ file: Chatbot.tsx:64 ~ handleSend ~ socketId:",
        socketId
      );
      // Call the createTask API with selected client
      const response = await createTask(selectedClient, input, socketId ?? "");
      const {_id: taskId} = response.data;

      // Listen for real-time task updates
      subscribeToTaskUpdates(taskId, (data) => {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: `Status: ${data.status} | Progress: ${data.progress}%\n${data.message}`,
          },
        ]);
      });

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Task is being processed, updates will be shown here...",
        },
      ]);
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
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Video Processing ChatBot
      </h2>

      {/* Client Selection Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Select Client
        </label>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          {clients.length > 0 ? (
            clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))
          ) : (
            <option disabled>No clients available</option>
          )}
        </select>
      </div>

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
          disabled={loading || !selectedClient}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2 hover:bg-blue-600 disabled:bg-blue-300"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
