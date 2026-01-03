import MarkdownEditor from "@/components/MarkdownEditor";
import { useUpdatePersonaMutation, usePersonaQuery } from "@/hooks/usePersona";
import { useParams } from "react-router-dom";

export default function PersonaDetails() {
  const { slug } = useParams();
  const { data: persona, isLoading } = usePersonaQuery(slug || "");

  const { mutate } = useUpdatePersonaMutation();

  const handleDescriptionChange = (newDescription: string) => {
    if (slug) {
      mutate({
        slug: slug,
        description: newDescription,
      });
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!persona || !slug) {
    return <div>Persona not found</div>;
  }

  return (
    <div className="bg-neutral-100 pt-4 grow h-10 px-4 pb-24 overflow-x-scroll">
      <MarkdownEditor
        value={persona.description || ""}
        onChange={handleDescriptionChange}
        className="mx-auto max-w-4xl p-0 w-full overflow-scroll bg-card rounded-md shadow-sm"
        placeholder="Add a description for your persona..."
      />
    </div>
  );
}
