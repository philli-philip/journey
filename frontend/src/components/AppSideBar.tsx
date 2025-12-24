import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

const Navigation = [
  {
    id: "uj1",
    name: "User Journeys",
    path: "/",
  },
];

export default function AppSideBar() {
  return (
    <Sidebar variant="sidebar" side="left">
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
  );
}
