// // import { useAuthContext } from "../../context/AuthContext";
// // import { extractTime } from "../../utils/extractTime";
// // import useConversation from "../../zustand/useConversation";

// // const Message = ({ message }) => {
// // 	const { authUser } = useAuthContext();
// // 	const { selectedConversation } = useConversation();
// // 	const fromMe = message.senderId === authUser._id;
// // 	const formattedTime = extractTime(message.createdAt);
// // 	const chatClassName = fromMe ? "chat-end" : "chat-start";
// // 	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
// // 	const bubbleBgColor = fromMe ? "bg-blue-500" : "";

// // 	const shakeClass = message.shouldShake ? "shake" : "";

// // 	return (
// // 		<div className={`chat ${chatClassName}`}>
// // 			<div className='chat-image avatar'>
// // 				<div className='w-10 rounded-full'>
// // 					<img alt='Tailwind CSS chat bubble component' src={profilePic} />
// // 				</div>
// // 			</div>
// // 			<div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>{message.message}</div>
// // 			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
// // 		</div>
// // 	);
// // };
// // export default Message;



// import { useAuthContext } from "../../context/AuthContext";
// import { extractTime } from "../../utils/extractTime";
// import useConversation from "../../zustand/useConversation";

// const Message = ({ message }) => {
//   const { authUser } = useAuthContext();
//   const { selectedConversation } = useConversation();

//   // Determine message alignment
//   const fromMe = message.senderId === authUser._id;
//   const formattedTime = extractTime(message.createdAt);
//   const chatClassName = fromMe ? "chat-end" : "chat-start";
//   const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
//   const bubbleBgColor = fromMe ? "bg-blue-500" : "bg-gray-700";
//   const shakeClass = message.shouldShake ? "shake" : "";

//   return (
//     <div className={`chat ${chatClassName}`}>
//       {/* Avatar */}
//       <div className='chat-image avatar'>
//         <div className='w-10 rounded-full'>
//           <img alt='user avatar' src={profilePic} />
//         </div>
//       </div>

//       <div>
//         {/* Chat bubble (text) */}
//         {message.message && (
//           <div
//             className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2 break-words max-w-xs md:max-w-md`}
//           >
//             {message.message}
//           </div>
//         )}

//         {/* File/Image bubble */}
//         {message.fileUrl && (
//           <div className='mt-2'>
//             {message.fileType?.startsWith("image/") ? (
//               // Show image inline
//               <img
//                 src={message.fileUrl}
//                 alt={message.fileName || "shared image"}
//                 className='rounded-lg max-w-xs md:max-w-md border border-gray-600'
//               />
//             ) : (
//               // Show file as downloadable link
//               <a
//                 href={message.fileUrl}
//                 target='_blank'
//                 rel='noopener noreferrer'
//                 download={message.fileName}
//                 className='flex items-center gap-2 text-sm text-blue-300 underline hover:text-blue-400 bg-gray-700 p-2 rounded-lg w-fit'
//               >
//                 <span>📎 {message.fileName || "Download file"}</span>
//               </a>
//             )}
//           </div>
//         )}

//         {/* Timestamp */}
//         <div className='chat-footer opacity-50 text-xs flex gap-1 items-center mt-1'>
//           {formattedTime}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Message;



import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
  try {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();

    // --- SAFE ID HANDLING ---
    const senderId =
      typeof message?.senderId === "object"
        ? message?.senderId?._id
        : message?.senderId || "";

    const fromMe = senderId === authUser?._id;
    const formattedTime = extractTime(message?.createdAt || new Date());
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe
      ? authUser?.profilePic
      : selectedConversation?.profilePic;
    const bubbleBgColor = fromMe ? "bg-blue-500" : "bg-gray-700";
    const shakeClass = message?.shouldShake ? "shake" : "";

    return (
      <div className={`chat ${chatClassName}`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="user avatar"
              src={profilePic || "/default.png"}
              onError={(e) => (e.target.src = "/default.png")}
            />
          </div>
        </div>

        <div>
          {/* --- TEXT BUBBLE --- */}
          {message?.message && (
            <div
              className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2 break-words max-w-xs md:max-w-md`}
            >
              {message.message}
            </div>
          )}

          {/* --- FILE OR IMAGE --- */}
          {message?.fileUrl && (
            <div className="mt-2">
              {message?.fileType?.startsWith?.("image/") ? (
                <img
                  src={message.fileUrl}
                  alt={message.fileName || "shared image"}
                  className="rounded-lg max-w-xs md:max-w-md border border-gray-600"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <a
                  href={message.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-300 underline hover:text-blue-400 bg-gray-700 p-2 rounded-lg w-fit"
                >
                  📎 {message.fileName || "Download file"}
                </a>
              )}
            </div>
          )}

          {/* --- TIMESTAMP --- */}
          <div className="chat-footer opacity-50 text-xs flex gap-1 items-center mt-1">
            {formattedTime}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Render crash in Message component:", error);
    return (
      <div className="text-center text-red-400 p-2">
        ⚠️ Failed to render message safely.
      </div>
    );
  }
};

export default Message;
