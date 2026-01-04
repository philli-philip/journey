import type { UserJourney } from "@shared/types";
import { KeyValue, KeyValueDivider, KeyValueList } from "../ui/key-value";
import { formatDate } from "@/lib/formats";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useState } from "react";
import { useAllPersonaQuery } from "@/hooks/usePersona";
import useJourney from "@/hooks/useJourney";

export default function DetailBox({ journey }: { journey: UserJourney }) {
  return (
    <div className="bg-card rounded-md shadow-sm w-80">
      <KeyValueList className="py-4" width={120}>
        <KeyValue
          label="Personas"
          value={
            <PersonaEdit journeyId={journey.id} personas={journey.personas} />
          }
        />
        <KeyValueDivider />
        <KeyValue
          label="Updated"
          value={formatDate(new Date(journey.updatedAt))}
        />
        <KeyValue
          label="Created"
          value={formatDate(new Date(journey.createdAt))}
        />
      </KeyValueList>
    </div>
  );
}

function PersonaEdit({
  journeyId,
  personas,
}: {
  journeyId: string;
  personas: UserJourney["personas"];
}) {
  const { data: allPersonas } = useAllPersonaQuery();
  const { updateJourney } = useJourney(journeyId);
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>(
    personas.map((p) => p.slug)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button asChild variant="ghost" size="sm" className="-mt-2 -ml-3">
          <span>
            {allPersonas?.find((p) => selectedPersonas.includes(p.slug))?.name +
              (selectedPersonas.length > 1
                ? " + " + (selectedPersonas.length - 1)
                : "") || "Select Personas"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {allPersonas?.map((p) => (
          <DropdownMenuCheckboxItem
            key={p.slug}
            checked={selectedPersonas.includes(p.slug)}
            onCheckedChange={(checked) => {
              const newPersonas = checked
                ? [...selectedPersonas, p.slug]
                : selectedPersonas.filter((s) => s !== p.slug);
              updateJourney({
                id: journeyId,
                updates: { personaSlugs: newPersonas },
              });
              setSelectedPersonas(newPersonas);
            }}
          >
            {p.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
