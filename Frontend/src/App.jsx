import Contacts from "./components/Contacts";
import ChatSection from "./components/ChatSection";
import { useState } from "react";
import { Routes, Route} from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { authUser } = useAuth();
  const [showContacts, setShowContacts] = useState(false);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <div className="flex flex-col bg-white sm:flex-row h-screen">
                <Contacts open={showContacts} onClose={() => setShowContacts(false)} />
                <ChatSection onOpenContacts={() => setShowContacts(true)} />
              </div>
            ) : (
              <Login />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
      </Routes>

    </>
  );
}
