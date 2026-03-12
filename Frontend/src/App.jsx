import { useState } from "react";
import { Routes, Route} from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import ChatBox from "./components/ChatBox.jsx";

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
              <ChatBox
                showContacts={showContacts}
                onCloseContacts={() => setShowContacts(false)}
                onOpenContacts={() => setShowContacts(true)}
              />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

    </>
  );
}
