// import { useEffect, useRef } from "react";
// import useGetMessages from "../../hooks/useGetMessages";
// import MessageSkeleton from "../skeletons/MessageSkeleton";
// import Message from "./Message";
// import useListenMessages from "../../hooks/useListenMessages";

// const Messages = () => {
// 	const { messages, loading } = useGetMessages();
// 	useListenMessages();
// 	const lastMessageRef = useRef();

// 	useEffect(() => {
// 		setTimeout(() => {
// 			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
// 		}, 100);
// 	}, [messages]);

// 	return (
// 		<div className='px-4 flex-1 overflow-auto'>
// 			{!loading &&
// 				messages.length > 0 &&
// 				messages.map((message) => (
// 					<div key={message._id} ref={lastMessageRef}>
// 						<Message message={message} />
// 					</div>
// 				))}

// 			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
// 			{!loading && messages.length === 0 && (
// 				<p className='text-center'>Send a message to start the conversation</p>
// 			)}
// 		</div>
// 	);
// };
// export default Messages;

// // STARTER CODE SNIPPET
// // import Message from "./Message";

// // const Messages = () => {
// // 	return (
// // 		<div className='px-4 flex-1 overflow-auto'>
// // 			<Message />
// // 			<Message />
// // 			<Message />
// // 			<Message />
// // 			<Message />
// // 			<Message />
// // 			<Message />
// // 			<Message />
// // 			<Message />
// // 			<Message />
// // 			<Message />
// // 			<Message />
// // 		</div>
// // 	);
// // };
// // export default Messages;


import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";
import ErrorBoundary from "../common/ErrorBoundary";

const Messages = () => {
  const { messages, loading } = useGetMessages();
  useListenMessages(); // 🔁 Real-time socket listener
  const lastMessageRef = useRef(null);

  // ✅ Auto-scroll to the latest message whenever messages change
  useEffect(() => {
    if (Array.isArray(messages) && messages.length > 0) {
      const timer = setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // ✅ Defensive check to prevent crashes
  if (!Array.isArray(messages)) {
    console.warn("⚠️ Messages is not an array:", messages);
    return (
      <div className="text-center text-red-400 p-4">
        ⚠️ Error: Messages data is invalid. Please try again.
      </div>
    );
  }

  return (
    <div className="px-4 flex-1 overflow-auto" aria-live="polite">
      <ErrorBoundary>
        {/* 🟢 When messages exist */}
        {!loading && messages.length > 0 && (
          <>
            {messages.map((message, index) => {
              const isLast = index === messages.length - 1;
              return (
                <div key={message._id || index} ref={isLast ? lastMessageRef : null}>
                  <Message message={message} />
                </div>
              );
            })}
          </>
        )}

        {/* 🟡 When loading (show skeleton placeholders) */}
        {loading &&
          [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

        {/* 🔴 When no messages are present */}
        {!loading && messages.length === 0 && (
          <p className="text-center text-gray-400">
            Send a message to start the conversation 💬
          </p>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default Messages;
