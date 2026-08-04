import { Outlet } from "react-router-dom";
import { NavBar } from "./Navbar";
import { ChatAssistant } from "../ChatAssistant";

export const Layout = () => {
  return (
    <div>
      <NavBar />
      <Outlet />
      <ChatAssistant />
    </div>
  );
};
