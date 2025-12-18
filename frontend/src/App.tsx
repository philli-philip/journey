import { Routes, Route } from "react-router-dom";
import SideNavigationLayout from "./components/layouts/SideNavigationLayout";
import { SidebarProvider } from "./components/ui/sidebar";
import { Empty, EmptyTitle } from "./components/ui/empty";
import UserJourneys from "./pages/UserJourneys";

function App() {
  return (
    <SidebarProvider>
      <Routes>
        <Route element={<SideNavigationLayout />}>
          <Route path="/" element={<UserJourneys />} />
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
  );
}

export default App;
