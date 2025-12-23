import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface GlobalCollapseContextType {
  globalCollapsedState: Record<string, boolean>;
  toggleGlobalCollapse: (section: string) => void;
}

const GlobalCollapseContext = createContext<
  GlobalCollapseContextType | undefined
>(undefined);

export const GlobalCollapseProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [globalCollapsedState, setGlobalCollapsedState] = useState<
    Record<string, boolean>
  >({
    description: false,
    services: false,
    insights: false,
    painPoints: false,
    image: false,
  });

  const toggleGlobalCollapse = (section: string) => {
    setGlobalCollapsedState((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <GlobalCollapseContext.Provider
      value={{ globalCollapsedState, toggleGlobalCollapse }}
    >
      {children}
    </GlobalCollapseContext.Provider>
  );
};

/* eslint-disable-next-line */
export const useGlobalCollapse = () => {
  const context = useContext(GlobalCollapseContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalCollapse must be used within a GlobalCollapseProvider"
    );
  }
  return context;
};
