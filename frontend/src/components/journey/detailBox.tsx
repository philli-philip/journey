import type { UserJourney } from "@shared/types";
import { KeyValue, KeyValueAccordion, KeyValueList } from "../ui/key-value";
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
  const [open, setOpen] = useState(false);
  return (
    <>
      <KeyValueList className="gap-2" width={120} open={open}>
        <KeyValue
          label="Personas"
          className="h-4"
          permanent
          value={
            <PersonaEdit journeyId={journey.id} personas={journey.personas} />
          }
        />
        <KeyValue
          label="Updated"
          value={formatDate(new Date(journey.updatedAt))}
        />
        <KeyValue
          label="Created"
          value={formatDate(new Date(journey.createdAt))}
        />
      </KeyValueList>
      <KeyValueAccordion open={open} toggleFunction={() => setOpen(!open)} />
    </>
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
            {selectedPersonas.length === 0 ? (
              <span className="text-muted-foreground">Select Personas</span>
            ) : (
              allPersonas?.find((p) => selectedPersonas.includes(p.slug))
                ?.name +
              (selectedPersonas.length > 1
                ? " + " + (selectedPersonas.length - 1)
                : "")
            )}
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
