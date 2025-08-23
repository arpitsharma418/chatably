
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Logout() {
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const handleLogout = async () => {
    const token = Cookies.get("token");
    axios.get(`${API_BASE}/api/logout`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      localStorage.removeItem("userInfo");
      navigate("/login");
    }).catch((error) => {
      console.log(error);
    })
  };

  return (
    <>
      <LogoutIcon onClick={handleLogout} className="cursor-pointer"/>
    </>
  );
}
