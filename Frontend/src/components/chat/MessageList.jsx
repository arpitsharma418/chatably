import { useEffect, useRef } from "react";

export default function MessageList({ messages, currentUserId, typingUser }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  return (
    <ul className="flex-1 space-y-2 overflow-y-auto pb-3 sm:space-y-3">
      {messages.map((message, index) => {
        const isOwnMessage = message.senderId === currentUserId;
        const key = message._id || `${message.senderId}-${index}`;

        return (
          <li
            key={key}
            className={`max-w-[80%] px-4 py-2 text-sm shadow ${
              isOwnMessage
                ? "ml-auto w-[70%] max-w-fit rounded-b-2xl rounded-l-2xl bg-orange-500 text-white"
                : "mr-auto w-[70%] max-w-fit rounded-b-2xl rounded-r-2xl bg-white text-slate-800"
            }`}
          >
            {message.text}
          </li>
        );
      })}

      {typingUser ? (
        <li className="mr-auto inline-flex max-w-[80%] items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
          <span>{typingUser.senderName} is typing</span>
          <span className="typing-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </li>
      ) : null}
      <li ref={messagesEndRef} />
    </ul>
  );
}
