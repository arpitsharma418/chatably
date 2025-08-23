import axios from "axios";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const getMyConversations = async() => {
    const res = await axios.get(`${API_BASE}/api/conversation`, {
        withCredentials: true,
    });

    return res.data;
}

export default getMyConversations;