import { Outlet, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

export default function SideNavigationLayout() {
  const Navigation = [
    {
      id: "uj1",
      name: "User Journeys",
      path: "/",
    },
    { id: "uj2", name: "Teams", path: "/teams" },
  ];
  return (
    <div className="flex min-h-screen w-screen bg-background">
      <Sidebar>
        <SidebarContent>
          <SidebarHeader>
            <img src="./../assets/react.svg" alt="logo" />
          </SidebarHeader>
          <SidebarGroup>
            <SidebarGroupContent>
              {Navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path}>{item.name}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <Outlet />
    </div>
  );
}
