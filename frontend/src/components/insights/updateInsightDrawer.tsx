import { useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { InsightTypes } from "@shared/types";
import { toast } from "sonner";
import { FieldError, FieldGroup, FieldLabel, Field } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getInsight } from "@/api/insights";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PreparedDrawer from "../layouts/Drawer";
import { useUpdateInsightMutation } from "@/hooks/useInsights";

export default function UpdateInsightDrawer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return null;
  }

  return (
    <PreparedDrawer
      title="Insight"
      open={searchParams.get("panel") === "insight"}
      onClose={() => setSearchParams({})}
    >
      <UpdateInsightForm id={id} />
    </PreparedDrawer>
  );
}

const formSchema = z.object({
  title: z.string().min(3, "At least 3 characters are required as title"),
  description: z.string(),
  type: z.enum(InsightTypes),
});

function UpdateInsightForm({ id }: { id: string }) {
  const [, setSearchParams] = useSearchParams();
  const updateInsight = useUpdateInsightMutation();
  const query = useQueryClient();
  const { data } = useQuery({
    queryKey: ["insight", id],
    queryFn: () => getInsight(id),
  });

  const form = useForm({
    defaultValues: {
      title: data?.title || "",
      type: (data?.type as string) || "pain",
      description: data?.description || "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      updateInsight.mutate(
        {
          id,
          updates: {
            title: value.title,
            description: value.description,
            type: value.type as InsightTypes,
          },
        },
        {
          onSuccess: () => {
            toast.success("Insight updated!");
            setSearchParams({});
            query.invalidateQueries({ queryKey: ["insights"] });
          },
        }
      );
    },
  });

  if (!id) {
    return null;
  }

  return (
    <>
      <form
        id="create-insight"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup className="px-4">
          <form.Field
            name="title"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                  <Input
                    required
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    aria-disabled={isInvalid}
                    onChange={(e) => field.handleChange(e.target.value)}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="type"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id={field.name} aria-disabled={isInvalid}>
                      <SelectValue placeholder="Select insight type" asChild>
                        <span className="capitalize">{field.state.value}</span>
                      </SelectValue>
                      <SelectContent>
                        {InsightTypes.map((item) => (
                          <SelectItem
                            key={item}
                            value={item}
                            className="capitalize"
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </Field>
              );
            }}
          />
          <form.Field
            name="description"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>

                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    aria-disabled={isInvalid}
                    autoComplete="off"
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <Field orientation="horizontal" className="justify-end">
            <Button
              variant="ghost"
              type="reset"
              onClick={() => setSearchParams({})}
            >
              Discard
            </Button>
            <Button type="submit">Update</Button>
          </Field>
        </FieldGroup>
      </form>
    </>
  );
}
