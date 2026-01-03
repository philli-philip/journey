import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

export interface TabNavigation {
  label: string;
  path: string;
}

export function Tabs({ tabs }: { tabs: TabNavigation[] }) {
  return (
    <div className="flex items-center flex-row gap-1 border-b pl-3 pb-0 border-border w-full">
      {tabs.map((tab) => (
        <Tab key={tab.path} {...tab} />
      ))}
    </div>
  );
}

export function Tab({ path, label }: { path: string; label: string }) {
  return (
    <NavLink
      key={path}
      className={({ isActive }) =>
        cn(
          isActive &&
            "after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-accent-foreground",
          "mr-4 px-2 py-0.5 mb-2 hover:bg-accent rounded relative duration-150"
        )
      }
      to={`/${path}`}
    >
      {label}
    </NavLink>
  );
}
