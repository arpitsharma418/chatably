import TypeMsg from "./TypeMsg";
import { useChat } from "../context/ChatContext.jsx";
import Loading from "../components/Loading";
import WavingHandIcon from '@mui/icons-material/WavingHand';
import {useEffect, useRef} from "react";


export default function ChatBox() {
  const { allmessages, loading, selectedConvo} = useChat();
  const loggedInUser = JSON.parse(localStorage.getItem("userInfo"));
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  };

  useEffect(() => {
    scrollToBottom();
  }, [allmessages]);

  if(selectedConvo === null){
    return(
      <>
        <div className="text-center mt-60 md:mt-40 bg-white">
          <WavingHandIcon sx={{fontSize: "7rem"}}/>
          <h1 className="mt-10 m-20 text-2xl md:text-xl">Your chats are lonely, <div>Pick one to keep them company.</div> </h1>
        </div>
      </>
    )
  }

  if(loading){
    return(
      <>
      <Loading/>
      </>
    )
  }

  if(allmessages.length === 0){
    return(
      <>
        <div className="text-center mt-40 sm:mt-40 md:mt-60 lg:mt-80">
          <WavingHandIcon sx={{fontSize: "5rem"}}/>
          <h1 className="mt-10 text-lg m-20 md:text-lg">Go on. <div>Say something before the awkward silence wins.</div></h1>
        </div>
        <TypeMsg/>
      </>
    )
  }

  return (
    <>
      <div className="w-full bg-white h-full flex flex-col min-h-0 p-2 text-xs sm:text-sm">
        <ul className="space-y-2 sm:space-y-3 overflow-y-auto flex-1 pb-16">
          {allmessages.map((msg, idx) => (
            <li
              key={idx}
              className={`p-3 text-base mt-2
                ${
                  loggedInUser.id === msg.senderId
                    ? "bg-gray-800 text-white ml-auto w-fit rounded-xl"
                    : "bg-gray-800 text-white mr-auto w-fit rounded-xl"
                }
            `}
            >
              {msg.text}
            </li>
          ))}
          <div ref={messagesEndRef}></div>
        </ul>
        <div className="flex-none">
          <TypeMsg />
        </div>
      </div>
    </>
  );
}
