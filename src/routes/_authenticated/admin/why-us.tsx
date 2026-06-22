import { createFileRoute } from "@tanstack/react-router";
import { CrudPanel } from "@/components/admin/CrudPanel";

export const Route = createFileRoute("/_authenticated/admin/why-us")({
  component: () => (
    <CrudPanel
      table="why_us" title="Why Choose Us"
      listColumns={[{ key: "title", label: "Title" }, { key: "icon", label: "Icon" }, { key: "sort_order", label: "Order" }, { key: "is_active", label: "Active" }]}
      defaultValues={{ sort_order: 0, is_active: true, icon: "ShieldCheck" }}
      fields={[
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "icon", label: "Lucide icon name", type: "text" },
        { key: "sort_order", label: "Sort order", type: "number" },
        { key: "is_active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});
