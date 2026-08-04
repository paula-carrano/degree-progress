import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ChatAssistant } from "../ChatAssistant";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-56">
        <Header onOpenMenu={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <ChatAssistant />
    </div>
  );
};
