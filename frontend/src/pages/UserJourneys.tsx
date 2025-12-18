import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { columns } from "@/components/user-journeys-columns";
import UserJourneyList from "@/components/userJourneyList";
import { mockUserJourneys } from "@/mockdata/mockJourneys";

export default function UserJourneys() {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-row p-1 items-center gap-2 border-b border-border">
        <Button asChild variant="ghost" size="icon">
          <SidebarTrigger />
        </Button>
        <h1 className="font-semibold">User Journeys</h1>
      </div>
      <UserJourneyList columns={columns} data={mockUserJourneys} />
    </div>
  );
}
