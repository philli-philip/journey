import { NavLink, Outlet, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { SidebarTrigger } from "../../components/ui/sidebar";
import { ArrowLeftIcon } from "lucide-react";
import useJourney from "@/hooks/useJourney";
import { Empty, EmptyTitle } from "../../components/ui/empty";
import { useState } from "react";
import { Input } from "../../components/ui/input";
import { cn } from "@/lib/utils";
import { PageTitle } from "../../components/ui/page-title";

const navItems = (journeyId: string) => [
  {
    label: "Overview",
    path: `${journeyId}/overview`,
  },
  {
    label: "Steps",
    path: `${journeyId}/steps`,
  },
];

export default function ViewLayout() {
  const journeyId = useParams().journeyId;
  const { journey, loading, error, updateJourney } = useJourney(
    journeyId ?? ""
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  const handleTitleUpdate = async () => {
    if (!journeyId || !journey || editedTitle === journey.name) {
      setIsEditingTitle(false);
      return;
    }
    updateJourney({
      id: journeyId,
      updates: { name: editedTitle },
    });
    setIsEditingTitle(false);
  };

  if (!journeyId) {
    return (
      <Empty>
        <EmptyTitle>404 Not Found</EmptyTitle>
      </Empty>
    );
  }

  if (loading) {
    return (
      <Empty>
        <EmptyTitle>Loading...</EmptyTitle>
      </Empty>
    );
  }

  if (error || !journey) {
    return (
      <Empty>
        <EmptyTitle>404 Not Found</EmptyTitle>
      </Empty>
    );
  }

  return (
    <>
      <PageTitle title={journey.name} />
      <header className="flex flex-col w-full">
        <div className="flex items-center h-12 gap-2 px-3 border-b">
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            className="cursor-pointer"
          >
            <SidebarTrigger />
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
          >
            <NavLink to="/">
              <ArrowLeftIcon size="16" />
              <span>User journeys</span>
            </NavLink>
          </Button>
          <span className="text-lg text-gray-400">/</span>
          <span className="font-semibold text-foreground pl-2">
            {journey.name}
          </span>
        </div>
        <div data-slot="journey-header" className="p-2 pl-4">
          {isEditingTitle ? (
            <Input
              value={editedTitle}
              onFocus={() => setEditedTitle(journey.name)}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleUpdate}
              autoFocus
              placeholder="Journey title"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleTitleUpdate();
                }
              }}
              className="text-xl p-0 m-0 font-semibold border-transparent outline-0 shadow-none placeholder:text-muted-foreground"
            />
          ) : (
            <h1
              className="font-semibold text-xl text-foreground pt-2 cursor-pointer"
              onClick={() => setIsEditingTitle(true)}
            >
              {journey.name}
            </h1>
          )}
        </div>
        <div className="flex items-center flex-row gap-1 border-b p-1 pl-3 pb-0 border-border w-full">
          {navItems(journeyId).map((item) => (
            <NavLink
              key={item.path}
              className={({ isActive }) =>
                cn(
                  isActive &&
                    "after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-accent-foreground",
                  "mr-4 px-2 py-0.5 mb-2 hover:bg-accent rounded relative duration-150"
                )
              }
              to={`/journey/${item.path}`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </header>
      <Outlet />
    </>
  );
}
