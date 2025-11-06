// import { useEffect } from "react";

// import { useSocketContext } from "../context/SocketContext";
// import useConversation from "../zustand/useConversation";

// import notificationSound from "../assets/sounds/notification.mp3";

// const useListenMessages = () => {
// 	const { socket } = useSocketContext();
// 	const { messages, setMessages } = useConversation();

// 	useEffect(() => {
// 		socket?.on("newMessage", (newMessage) => {
// 			newMessage.shouldShake = true;
// 			const sound = new Audio(notificationSound);
// 			sound.play();
// 			setMessages([...messages, newMessage]);
// 		});

// 		return () => socket?.off("newMessage");
// 	}, [socket, setMessages, messages]);
// };
// export default useListenMessages;





// import { useEffect } from "react";
// import { useSocketContext } from "../context/SocketContext";
// import useConversation from "../zustand/useConversation";

// const useListenMessages = () => {
//   const { socket } = useSocketContext();
//   const { messages, setMessages } = useConversation();

//   useEffect(() => {
//     if (!socket) return;

//     const handleNewMessage = (newMessage) => {
//       console.log("📩 New message received via socket:", newMessage);

//       // ✅ Safely update messages list
//       setMessages((prev) => [...prev, newMessage]);
//     };

//     socket.on("newMessage", handleNewMessage);

//     // Cleanup when socket disconnects
//     return () => {
//       socket.off("newMessage", handleNewMessage);
//     };
//   }, [socket, setMessages]);

//   return { messages };
// };

// export default useListenMessages;





// import { useEffect } from "react";
// import { useSocketContext } from "../context/SocketContext";
// import useConversation from "../zustand/useConversation";
// import { useAuthContext } from "../context/AuthContext";

// const useListenMessages = () => {
//   const { socket } = useSocketContext();
//   const { addMessage } = useConversation();
//   const { authUser } = useAuthContext();

//   useEffect(() => {
//     if (!socket || typeof socket.on !== "function") return;

//     const handleNewMessage = (newMessage) => {
//       if (!newMessage) return;

//       // ✅ Ignore messages sent by the current user (already displayed)
//       if (newMessage.senderId === authUser?._id) return;

//       console.log("📩 Received via socket:", newMessage);
//       addMessage(newMessage);
//     };

//     socket.on("newMessage", handleNewMessage);

//     return () => {
//       socket.off("newMessage", handleNewMessage);
//     };
//   }, [socket, addMessage, authUser?._id]);
// };

// export default useListenMessages;



import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import { useAuthContext } from "../context/AuthContext";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { addMessage } = useConversation();
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (!socket || typeof socket.on !== "function") return;

    const handleNewMessage = (newMessage) => {
      if (!newMessage) return;

      // If this event is for a message sent by current user, skip (we already showed it optimistically and replaced)
      if (newMessage.senderId === authUser?._id) return;

      addMessage(newMessage);
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, addMessage, authUser?._id]);
};

export default useListenMessages;
