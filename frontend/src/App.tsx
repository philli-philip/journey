import { Routes, Route } from "react-router-dom";
import SideNavigationLayout from "./components/layouts/SideNavigationLayout";
import { SidebarProvider } from "./components/ui/sidebar";
import { Empty, EmptyTitle } from "./components/ui/empty";
import UserJourneys from "./pages/journeys/journeyList.tsx";
import JourneyView from "./pages/journeys/JourneySteps.tsx";
import ViewLayout from "./pages/journeys/journeyLayout.tsx";
import JourneyOverview from "./pages/journeys/JourneyOverview.tsx";
import InsightsPage from "./pages/InsightsList.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import PersonaList from "./pages/personas/personaList.tsx";
import PersonaDetails from "./pages/personas/personaDetails.tsx";
import PersonaLayout from "./pages/personas/personasLayout.tsx";
import PersonaJourneys from "./pages/personas/personaJourneys.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Routes>
          <Route element={<SideNavigationLayout />}>
            <Route path="/" element={<UserJourneys />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/personas" element={<PersonaList />} />
            <Route path="/personas/:slug" element={<PersonaLayout />}>
              <Route path="overview" element={<PersonaDetails />} />
              <Route path="journeys" element={<PersonaJourneys />} />
            </Route>
            <Route
              path="/personas/:slug/overview"
              element={<PersonaDetails />}
            />
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
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
