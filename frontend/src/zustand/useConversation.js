// import { create } from "zustand";

// const useConversation = create((set) => ({
//   selectedConversation: null,
//   messages: [], // always array

//   setSelectedConversation: (conversation) =>
//     set({ selectedConversation: conversation }),

//   // Replace all messages (used when loading a conversation)
//   setMessages: (messages) =>
//     set({
//       messages: Array.isArray(messages) ? messages : [],
//     }),

//   // Append a new message (used when sending/receiving)
//   addMessage: (newMessage) =>
//     set((state) => ({
//       messages: Array.isArray(state.messages)
//         ? [...state.messages, newMessage]
//         : [newMessage],
//     })),
// }));

// export default useConversation;




import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  messages: [],

  setSelectedConversation: (conversation) =>
    set({ selectedConversation: conversation }),

  // replace entire messages array
  setMessages: (messages) =>
    set({
      messages: Array.isArray(messages) ? messages : [],
    }),

  // append a single message
  addMessage: (newMessage) =>
    set((state) => ({
      messages: Array.isArray(state.messages)
        ? [...state.messages, newMessage]
        : [newMessage],
    })),

  // replace a message by its _id (used to replace temp message with real one)
  replaceMessage: (tempId, newMessage) =>
    set((state) => ({
      messages: state.messages.map((m) => (m._id === tempId ? newMessage : m)),
    })),
}));

export default useConversation;
