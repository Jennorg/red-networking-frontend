import Aside from "@/components/layout/aside/Aside";
import Header from "@/components/layout/header/Header"
import Main from "@/components/layout/main/Main"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">          
      <SidebarProvider>               
        <Aside />
        <main className="w-full">          
          <Header />           
          <Main />
        </main>
      </SidebarProvider>      
    </div>
  );
}

