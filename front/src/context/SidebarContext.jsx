import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <SidebarContext.Provider value={{ openSidebar, setOpenSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
