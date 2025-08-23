import axios from "axios";

const getMyConversations = async() => {
    const res = await axios.get(`https://chatably.onrender.com/api/conversation`, {
        withCredentials: true,
    });

    return res.data;
}

export default getMyConversations;