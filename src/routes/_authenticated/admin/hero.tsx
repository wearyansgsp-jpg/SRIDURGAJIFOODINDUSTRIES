import { createFileRoute } from "@tanstack/react-router";
import { CrudPanel } from "@/components/admin/CrudPanel";

export const Route = createFileRoute("/_authenticated/admin/hero")({
  component: () => (
    <CrudPanel
      table="hero_slides" title="Hero Slides"
      listColumns={[{ key: "title", label: "Title" }, { key: "eyebrow", label: "Eyebrow" }, { key: "sort_order", label: "Order" }, { key: "is_active", label: "Active" }]}
      defaultValues={{ sort_order: 0, is_active: true }}
      fields={[
        { key: "eyebrow", label: "Eyebrow", type: "text" },
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "image", label: "Image URL", type: "url" },
        { key: "sort_order", label: "Sort order", type: "number" },
        { key: "is_active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});
