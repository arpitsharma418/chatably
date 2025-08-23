import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import axios from "axios";
import {useChat} from "../context/ChatContext.jsx";
import { useSocket } from "../context/SocketContext.jsx";

export default function TypeMsg() {
  const [text, setText] = useState("");
  const {selectedConvo} = useChat();
  const loggedInUser = JSON.parse(localStorage.getItem("userInfo"));
  const {sendMessage} = useSocket();

  const receiver = selectedConvo && selectedConvo.members.find((member) => member._id !== loggedInUser.id);

  const receiverId = receiver? receiver._id : null;


  const handleSendMessage = async (event) => {
    event.preventDefault();
    const timmedText = text.trim();
    if(timmedText === ""){
      setText("");
      return alert("Type something!");
    }
    sendMessage({receiverId, text});
    await axios
      .post(
        `https://chatably.onrender.com/api/message`,
        {
          text,
          receiverId,
        },
        { withCredentials: true }
      )
      .then(() => {
        console.log("OK");
      })
      .catch((error) => {
        console.log(error);
      });
      setText("");
  };

  const handleOnChange = (event) => {
    setText(event.target.value);
  };

  return (
    <>
      <form
        onSubmit={handleSendMessage}
        className="flex justify-between border p-3 md:p-2 bg-gray-600 rounded-2xl"
      >
        <input
          type="text"
          className="outline-none p-2 w-[85%] text-sm text-white"
          placeholder="type message"
          value={text}
          onChange={handleOnChange}
          id="text"
        />
        {text === ""? <button type="submit" disabled >
          <SendIcon className="cursor-pointer text-gray-400 -rotate-45 mb-2" sx={{fontSize: "1.7rem"}} />
        </button>: <button type="submit">
          <SendIcon className="cursor-pointer text-sm text-white -rotate-45 mb-2" sx={{fontSize: "1.7rem"}} />
        </button> }
        
      </form>
    </>
  );
}
