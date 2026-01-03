import { DetailHeader, HeaderTitle } from "@/components/layouts/blocks/header";
import { Button } from "@/components/ui/button";
import { useAllPersonaQuery } from "@/hooks/usePersona";
import PersonTable from "../../components/personas/personaTable";
import { usePersonaColumns } from "../../components/personas/personTableColumns";
import { PlusIcon } from "lucide-react";

export default function PersonaList() {
  const { data: personasList, isLoading } = useAllPersonaQuery();
  const columns = usePersonaColumns();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!personasList) {
    return <div>No personas found</div>;
  }

  return (
    <>
      <DetailHeader>
        <HeaderTitle className="flex-1">Personas</HeaderTitle>
        <Button size="sm">
          <PlusIcon size="16" />
          New persona
        </Button>
      </DetailHeader>
      <PersonTable columns={columns} data={personasList} />
    </>
  );
}
