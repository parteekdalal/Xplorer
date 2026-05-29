import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import Chat from "./components/chat.jsx";

export default function App() {
  return (
    <div className="id">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/:method?" element={<Auth />} />
        <Route path="/chat/:roomId" element={<Chat />} />
      </Routes>
      <ToastContainer
        style={{ top: "100px" }}
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  )
}