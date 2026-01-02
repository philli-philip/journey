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
  {
    id: "in1",
    name: "Insights",
    path: "/insights",
  },
];

const Logo = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 237 237"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M236.167 118.083L118.084 236.167L0 118.083L118.084 0L236.167 118.083ZM62.333 118.083L118.084 173.833L173.834 118.083H62.333Z"
      fill="black"
    />
  </svg>
);

export default function AppSideBar() {
  return (
    <Sidebar variant="sidebar" side="left">
      <SidebarContent>
        <SidebarHeader className="flex items-center flex-row pl-3 pt-4">
          <Logo />
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            {Navigation.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={item.path === window.location.pathname}
                >
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
