import { DetailHeader, HeaderTitle } from "@/components/layouts/blocks/header";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/navTabs";
import { PageTitle } from "@/components/ui/page-title";
import { usePersonaQuery, useUpdatePersonaMutation } from "@/hooks/usePersona";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";

export default function PersonaLayout() {
  const { slug } = useParams();
  const { data: persona, isLoading } = usePersonaQuery(slug || "");
  const [isTitleEditing, setTitleEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(persona?.name || "");
  const mutate = useUpdatePersonaMutation();
  const client = useQueryClient();

  const handleTitleUpdate = async () => {
    console.log("handle title update");
    if (!slug || !persona) return;
    mutate.mutate(
      { slug: persona.slug, changes: { name: newTitle } },
      {
        onSuccess: () => {
          setTitleEditing(false);
          client.invalidateQueries({ queryKey: ["personas", persona.slug] });
        },
      }
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!persona || !slug) {
    return <div>Persona not found</div>;
  }

  return (
    <>
      <DetailHeader>
        <PageTitle title={persona.name} />
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

        <HeaderTitle className="flex-1 p-1">{persona.name}</HeaderTitle>
      </DetailHeader>
      {isTitleEditing ? (
        <div className="pt-4 pb-4 pl-4">
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleTitleUpdate}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTitleUpdate();
              }
            }}
            className="text-xl min-w-[24ch] w-[80%] font-bold bg-stone-100 border-none focus-visible:outline-4 outline-4 ring-1 focus-visible:ring-1 ring-orange-400/50 rounded-sm outline-orange-700/10 px-2 py-1 appearance-none m-0 shadow-none"
          />
        </div>
      ) : (
        <div className="pt-4 pb-4 pl-4 ">
          <button
            onClick={() => {
              setTitleEditing(true);
              setNewTitle(persona.name);
            }}
            className="cursor-pointer rounded-md hover:bg-stone-100 px-2 py-1 block"
          >
            <h1 className="text-xl font-bold ">{persona.name}</h1>
          </button>
        </div>
      )}
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
