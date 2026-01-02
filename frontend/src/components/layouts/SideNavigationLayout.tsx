import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import AppSideBar from "../AppSideBar";

export default function SideNavigationLayout() {
  return (
    <SidebarProvider>
      <AppSideBar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
