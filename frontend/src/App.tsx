import { Routes, Route } from "react-router-dom";
import SideNavigationLayout from "./components/layouts/SideNavigationLayout";
import { SidebarProvider } from "./components/ui/sidebar";
import { Empty, EmptyTitle } from "./components/ui/empty";
import UserJourneys from "./pages/UserJourneys.tsx";
import JourneyView from "./pages/JourneySteps.tsx";
import ViewLayout from "./components/layouts/Viewdetail.tsx";
import JourneyOverview from "./pages/JourneyOverview.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Routes>
          <Route element={<SideNavigationLayout />}>
            <Route path="/" element={<UserJourneys />} />
            <Route path="journey" element={<ViewLayout />}>
              <Route path=":journeyId/overview" element={<JourneyOverview />} />
              <Route path=":journeyId/steps?" element={<JourneyView />} />
            </Route>
            <Route
              path="*"
              element={
                <Empty>
                  <EmptyTitle>404 Not Found</EmptyTitle>
                </Empty>
              }
            />
          </Route>
        </Routes>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;
