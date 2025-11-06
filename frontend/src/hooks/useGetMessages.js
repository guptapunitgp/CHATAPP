import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation?._id) {
        setMessages([]); // reset when no conversation
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${selectedConversation._id}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json().catch(() => null);

        if (Array.isArray(data)) {
          setMessages(data); // ✅ store full conversation
        } else {
          console.warn("⚠️ Invalid response:", data);
          setMessages([]);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        toast.error("Failed to load messages");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedConversation?._id, setMessages]);

  // Always return an array (prevent map() error)
  return { messages: Array.isArray(messages) ? messages : [], loading };
};

export default useGetMessages;
