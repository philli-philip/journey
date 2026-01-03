import { DetailHeader, HeaderTitle } from "@/components/layouts/blocks/header";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/navTabs";
import { usePersonaQuery } from "@/hooks/usePersona";
import { ArrowLeft } from "lucide-react";
import { Link, Outlet, useParams } from "react-router-dom";

export default function PersonaLayout() {
  const { slug } = useParams();
  const { data: persona, isLoading } = usePersonaQuery(slug || "");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!persona || !slug) {
    return <div>Persona not found</div>;
  }

  return (
    <>
      <DetailHeader>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground -ml-2"
          asChild
        >
          <Link to="/personas">
            <ArrowLeft size="16" />
            Personas
          </Link>
        </Button>
        <span aria-hidden className="text-gray-400 pr-2 text-lg">
          /
        </span>
        <HeaderTitle className="flex-1">{persona.name}</HeaderTitle>
      </DetailHeader>
      <h1 className="text-xl font-bold pt-4 pb-4 pl-4">{persona.name}</h1>
      <Tabs
        tabs={[
          { label: "Overview", path: `./personas/${slug}/overview` },
          { label: "Journeys", path: `./personas/${slug}/journeys` },
        ]}
      />
      <Outlet />
    </>
  );
}
