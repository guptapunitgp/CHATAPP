// import { useState } from "react";
// import useConversation from "../zustand/useConversation";
// import toast from "react-hot-toast";

// const useSendMessage = () => {
// 	const [loading, setLoading] = useState(false);
// 	const { messages, setMessages, selectedConversation } = useConversation();

// 	const sendMessage = async (message) => {
// 		setLoading(true);
// 		try {
// 			const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({ message }),
// 			});
// 			const data = await res.json();
// 			if (data.error) throw new Error(data.error);

// 			setMessages([...messages, data]);
// 		} catch (error) {
// 			toast.error(error.message);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return { sendMessage, loading };
// };
// export default useSendMessage;



// import { useState } from "react";
// import useConversation from "../zustand/useConversation";
// import toast from "react-hot-toast";

// const useSendMessage = () => {
//   const [loading, setLoading] = useState(false);
//   const { messages, setMessages, selectedConversation } = useConversation();

//   const sendMessage = async (text, file) => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("message", text);
//       if (file) formData.append("file", file);

//       const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) throw new Error("Failed to send message");

//       const data = await res.json();
//       setMessages((prev) => [...prev, data]);
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { sendMessage, loading };
// };

// export default useSendMessage;




// import { useState } from "react";
// import useConversation from "../zustand/useConversation";
// import toast from "react-hot-toast";
// import { useAuthContext } from "../context/AuthContext";

// const useSendMessage = () => {
//   const [loading, setLoading] = useState(false);
//   const { addMessage, selectedConversation } = useConversation();
//   const { authUser } = useAuthContext();

//   const sendMessage = async (text = "", file = null) => {
//     if (!selectedConversation?._id) return toast.error("No chat selected");
//     if (!text.trim() && !file) return; // Don’t send empty message

//     // 🟢 Optimistic message: show instantly
//     const tempMessage = {
//       _id: Date.now(),
//       senderId: authUser._id,
//       receiverId: selectedConversation._id,
//       message: text,
//       fileUrl: file ? URL.createObjectURL(file) : "",
//       fileName: file?.name || "",
//       fileType: file?.type || "",
//       createdAt: new Date().toISOString(),
//       shouldShake: false,
//     };

//     addMessage(tempMessage);
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("message", text);
//       if (file) formData.append("file", file);

//       const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       });

//       const data = await res.json().catch(() => null);

//       if (!res.ok || !data) {
//         throw new Error(data?.error || "Failed to send message");
//       }

//       addMessage(data); // ✅ append the real message
//     } catch (err) {
//       console.error("Error sending message:", err);
//       toast.error(err.message || "Message failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { sendMessage, loading };
// };

// export default useSendMessage;






import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { addMessage, replaceMessage, selectedConversation } = useConversation();
  const { authUser } = useAuthContext();

  const sendMessage = async (text = "", file = null) => {
    if (!selectedConversation?._id) return toast.error("No chat selected");
    if (!text.trim() && !file) return;

    // Create a unique temp id (string)
    const tempId = `temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Optimistic message (temporary)
    const tempMessage = {
      _id: tempId,
      __temp: true,
      senderId: authUser._id,
      receiverId: selectedConversation._id,
      message: text,
      fileUrl: file ? URL.createObjectURL(file) : "",
      fileName: file?.name || "",
      fileType: file?.type || "",
      createdAt: new Date().toISOString(),
    };

    // show optimistic message
    addMessage(tempMessage);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", text);
      if (file) formData.append("file", file);

      const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        throw new Error(data?.error || "Failed to send message");
      }

      // Replace temp message with server-returned message
      replaceMessage(tempId, data);
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error(err.message || "Message failed");

      // Remove the temp message on failure (optional)
      // Replace it with an error message or remove. For simplicity remove here:
      replaceMessage(tempId, {
        _id: tempId,
        senderId: authUser._id,
        receiverId: selectedConversation._id,
        message: text + " (failed to send)",
        fileUrl: "",
        fileName: "",
        fileType: "",
        createdAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;
