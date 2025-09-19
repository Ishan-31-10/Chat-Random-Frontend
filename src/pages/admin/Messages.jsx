import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    api.get("/messages/all").then((r) => setMessages(r.data || [])).catch(() => alert("Failed to load messages"));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Messages</h1>
      <div className="bg-white rounded shadow p-4">
        {messages.length === 0 ? <div className="text-sm text-gray-500">No messages</div> : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">From</th>
                <th className="p-2 text-left">To</th>
                <th className="p-2 text-left">Content</th>
                <th className="p-2 text-left">At</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m._id || m.id} className="border-t">
                  <td className="p-2">{m.sender?.username ?? m.sender}</td>
                  <td className="p-2">{m.receiver?.username ?? m.receiver}</td>
                  <td className="p-2">{m.content}</td>
                  <td className="p-2 text-sm">{new Date(m.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
