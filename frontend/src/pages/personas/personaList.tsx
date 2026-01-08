import { DetailHeader, HeaderTitle } from "@/components/layouts/blocks/header";
import { Button } from "@/components/ui/button";
import {
  useAllPersonaQuery,
  useCreatePersonaMutation,
} from "@/hooks/usePersona";
import PersonTable from "../../components/personas/personaTable";
import { usePersonaColumns } from "../../components/personas/personTableColumns";
import { PlusIcon } from "lucide-react";
import { PageTitle } from "@/components/ui/page-title";
import { toast } from "sonner";
import { Empty } from "@/components/ui/empty";

export default function PersonaList() {
  const { data: personasList, isLoading, isError } = useAllPersonaQuery();
  const columns = usePersonaColumns();

  const { mutate } = useCreatePersonaMutation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!personasList || isError) {
    return <Empty title="No personas found" />;
  }

  const actions = (
    <Button
      size="sm"
      onClick={() =>
        mutate(
          { name: "New Persona", slug: "new-persona" },
          {
            onSuccess: () => toast.success("Persona created"),
            onError: () => toast.error("Persona with this slug already exists"),
          }
        )
      }
    >
      <PlusIcon size="16" />
      New persona
    </Button>
  );

  return (
    <>
      <DetailHeader>
        <PageTitle title="Personas" />
        <HeaderTitle className="flex-1">Personas</HeaderTitle>
      </DetailHeader>
      <PersonTable columns={columns} data={personasList} actions={actions} />
    </>
  );
}
