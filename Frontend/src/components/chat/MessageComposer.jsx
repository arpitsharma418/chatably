import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { useSocket } from "../../context/SocketContext";
import { IconSend, IconSparkles } from "../UI";
import { getConversationPeer } from "./chatUtils";

export default function MessageComposer() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState("");

  const { selectedConvo, allmessages } = useChat();
  const { authUser } = useAuth();
  const { sendMessage, emitTyping, emitStopTyping } = useSocket();

  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const receiver = getConversationPeer(selectedConvo, authUser?.id);
  const receiverId = receiver?._id || null;
  const conversationId = selectedConvo?._id || null;

  const stopTyping = useCallback(() => {
    if (!receiverId || !isTypingRef.current) {
      return;
    }

    emitStopTyping(receiverId);
    isTypingRef.current = false;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [emitStopTyping, receiverId]);

  const fetchSmartReplies = useCallback(async (draft = text) => {
    if (!conversationId || !receiverId) {
      return;
    }

    setLoadingSuggestions(true);
    setSuggestionsError("");

    try {
      const response = await api.post("/api/message/smart-replies", {
        conversationId,
        draftText: draft,
      });
      setSuggestions(Array.isArray(response.data?.replies) ? response.data.replies : []);
    } catch (requestError) {
      const message =
        requestError?.response?.data || "Smart replies are unavailable right now.";
      setSuggestionsError(String(message));
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, [conversationId, receiverId, text]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText) {
      setText("");
      setError("Type something to send.");
      return;
    }

    if (!receiverId) {
      setError("Select a conversation first.");
      return;
    }

    setError("");
    stopTyping();
    sendMessage({ receiverId, text: trimmedText });

    try {
      await api.post("/api/message", { text: trimmedText, receiverId });
    } catch (sendError) {
      console.log(sendError);
    } finally {
      setText("");
      setSuggestions([]);
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setText(value);
    setError("");

    if (!receiverId) {
      return;
    }

    if (!value.trim()) {
      stopTyping();
      return;
    }

    if (!isTypingRef.current) {
      emitTyping(receiverId);
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1200);
  };

  useEffect(() => {
    setSuggestions([]);
    setSuggestionsError("");
    setText("");
    stopTyping();
  }, [conversationId, stopTyping]);

  useEffect(() => {
    if (!conversationId || !receiverId || text.trim()) {
      return;
    }
    fetchSmartReplies("");
  }, [allmessages.length, conversationId, fetchSmartReplies, receiverId, text]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      stopTyping();
    };
  }, [stopTyping]);

  return (
    <div className="flex-none">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-full border border-blue-100 bg-white p-2 shadow-sm"
      >
        <input
          type="text"
          className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          placeholder="Type your message"
          aria-label="Message"
          value={text}
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={text.trim() === ""}
          className="rounded-full bg-blue-600 px-3 py-3 text-white disabled:cursor-not-allowed disabled:bg-blue-300"
          aria-label="Send message"
        >
          <IconSend />
        </button>
      </form>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => fetchSmartReplies(text)}
          disabled={!conversationId || loadingSuggestions}
          className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <IconSparkles className="h-4 w-4" />
          {loadingSuggestions ? "Thinking..." : "Smart replies"}
        </button>

        {suggestions.map((reply, index) => (
          <button
            key={`${reply}-${index}`}
            type="button"
            onClick={() => setText(reply)}
            className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-blue-50"
          >
            {reply}
          </button>
        ))}
      </div>

      {suggestionsError ? <p className="mt-2 text-xs text-rose-600">{suggestionsError}</p> : null}
      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
