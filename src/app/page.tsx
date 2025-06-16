import Aside from "@/components/layout/aside/Aside";
import Header from "@/components/layout/header/Header"
import Main from "@/components/layout/main/Main"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />           
      <div className="flex flex-1 overflow-hidden">
        <Aside />
        <Main />
      </div>
    </div>
  );
}