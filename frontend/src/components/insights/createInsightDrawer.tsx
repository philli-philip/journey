import { Link, useSearchParams } from "react-router-dom";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { X } from "lucide-react";
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
import { createInsight } from "@/api/insights";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateInsightDrawer() {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <Drawer
      direction="right"
      dismissible={true}
      open={searchParams.get("panel") === "create-insight"}
    >
      <DrawerTrigger>
        <Button asChild size="sm">
          <Link to="?panel=create-insight">New insight</Link>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New insight</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <DrawerClose asChild>
          <Button
            className="absolute top-2 right-2"
            variant="outline"
            size="icon"
            onClick={() => setSearchParams({})}
          >
            <X />
          </Button>
        </DrawerClose>
        <CreateInsightForm />
      </DrawerContent>
    </Drawer>
  );
}

const formSchema = z.object({
  title: z.string().min(3, "At least 3 characters are required as title"),
  description: z.string(),
  type: z.enum(InsightTypes),
});

function CreateInsightForm() {
  const [, setSearchParams] = useSearchParams();
  const query = useQueryClient();
  const form = useForm({
    defaultValues: {
      title: "",
      type: "pain",
      description: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await createInsight(value);
      if (response.ok) {
        toast.success("Insight created successfully!");
        setSearchParams({});
        query.invalidateQueries({ queryKey: ["insights"] });
      } else {
        toast.error("Failed to create insight");
      }
    },
  });
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
                    autoFocus
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
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </Field>
        </FieldGroup>
      </form>
    </>
  );
}
