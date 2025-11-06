// import { useState } from "react";
// import { BsSend } from "react-icons/bs";
// import useSendMessage from "../../hooks/useSendMessage";

// const MessageInput = () => {
// 	const [message, setMessage] = useState("");
// 	const { loading, sendMessage } = useSendMessage();

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		if (!message) return;
// 		await sendMessage(message);
// 		setMessage("");
// 	};

// 	return (
// 		<form className='px-4 my-3' onSubmit={handleSubmit}>
// 			<div className='w-full relative'>
// 				<input
// 					type='text'
// 					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
// 					placeholder='Send a message'
// 					value={message}
// 					onChange={(e) => setMessage(e.target.value)}
// 				/>
// 				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
// 					{loading ? <div className='loading loading-spinner'></div> : <BsSend />}
// 				</button>
// 			</div>
// 		</form>
// 	);
// };
// export default MessageInput;

// // STARTER CODE SNIPPET
// // import { BsSend } from "react-icons/bs";

// // const MessageInput = () => {
// // 	return (
// // 		<form className='px-4 my-3'>
// // 			<div className='w-full'>
// // 				<input
// // 					type='text'
// // 					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
// // 					placeholder='Send a message'
// // 				/>
// // 				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
// // 					<BsSend />
// // 				</button>
// // 			</div>
// // 		</form>
// // 	);
// // };
// // export default MessageInput;




import { useState, useRef } from "react";
import { BsSend, BsPaperclip, BsEmojiSmile } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import Picker from "emoji-picker-react";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const { loading, sendMessage } = useSendMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message && !file) return;
    await sendMessage(message, file);
    setMessage("");
    setFile(null);
    setShowPicker(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onEmojiClick = (emoji) => setMessage((prev) => prev + emoji.emoji);

  return (
    <div className="p-3 bg-gray-800 rounded-lg">
      {showPicker && (
        <div className="mb-2 absolute bottom-16 z-50">
          <Picker onEmojiClick={onEmojiClick} theme="dark" />
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowPicker((prev) => !prev)}
          className="text-gray-300"
        >
          <BsEmojiSmile className="w-6 h-6" />
        </button>

        <label className="cursor-pointer text-gray-300">
          <BsPaperclip className="w-6 h-6" />
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files[0])}
            accept="image/*,application/pdf,.doc,.docx,.zip"
            className="hidden"
          />
        </label>

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-gray-700 text-white rounded px-3 py-2 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded"
        >
          <BsSend />
        </button>
      </form>
      {file && (
        <p className="text-xs text-gray-400 mt-1">📎 {file.name}</p>
      )}
    </div>
  );
};

export default MessageInput;
