import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import AppSideBar from "../AppSideBar";

export default function SideNavigationLayout() {
  return (
    <div className="flex flex-col flex-1">
      <SidebarProvider>
        <AppSideBar />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
