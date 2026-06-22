import { createFileRoute } from "@tanstack/react-router";
import { CrudPanel } from "@/components/admin/CrudPanel";

export const Route = createFileRoute("/_authenticated/admin/presidents")({
  component: () => (
    <CrudPanel
      table="presidents" title="Leadership"
      listColumns={[{ key: "name", label: "Name" }, { key: "role", label: "Role" }, { key: "sort_order", label: "Order" }, { key: "is_active", label: "Active" }]}
      defaultValues={{ sort_order: 0, is_active: true }}
      fields={[
        { key: "name", label: "Name", type: "text" },
        { key: "role", label: "Role", type: "text" },
        { key: "image", label: "Photo URL", type: "url" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "sort_order", label: "Sort order", type: "number" },
        { key: "is_active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});
