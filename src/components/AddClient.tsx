import React, {useState} from "react";
import {addClient} from "../apis/createClient";

const AddClient: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [formatDocument, setFormatDocument] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await addClient(name, formatDocument);
      setSuccessMessage("Client added successfully!");
      setName("");
      setFormatDocument("");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Client</h2>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-500 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-500 text-red-800 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Client Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter client name"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Document Format
          </label>
          <textarea
            value={formatDocument}
            onChange={(e) => setFormatDocument(e.target.value)}
            placeholder="Enter document format"
            rows={5}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Adding Client..." : "Add Client"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClient;
