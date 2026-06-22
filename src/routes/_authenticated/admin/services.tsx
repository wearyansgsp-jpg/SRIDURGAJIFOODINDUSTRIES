import { createFileRoute } from "@tanstack/react-router";
import { CrudPanel } from "@/components/admin/CrudPanel";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: () => (
    <CrudPanel
      table="services" title="Services"
      listColumns={[{ key: "title", label: "Title" }, { key: "icon", label: "Icon" }, { key: "sort_order", label: "Order" }, { key: "is_active", label: "Active" }]}
      defaultValues={{ sort_order: 0, is_active: true, icon: "Factory" }}
      fields={[
        { key: "title", label: "Title", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "icon", label: "Lucide icon name", type: "text", placeholder: "Factory, Truck, Warehouse…" },
        { key: "sort_order", label: "Sort order", type: "number" },
        { key: "is_active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});
