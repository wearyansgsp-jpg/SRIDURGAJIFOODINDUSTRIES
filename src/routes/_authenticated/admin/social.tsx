import { createFileRoute } from "@tanstack/react-router";
import { CrudPanel } from "@/components/admin/CrudPanel";

export const Route = createFileRoute("/_authenticated/admin/social")({
  component: () => (
    <CrudPanel
      table="social_links" title="Social Links"
      listColumns={[{ key: "name", label: "Name" }, { key: "url", label: "URL" }, { key: "sort_order", label: "Order" }, { key: "is_active", label: "Active" }]}
      defaultValues={{ sort_order: 0, is_active: true }}
      fields={[
        { key: "name", label: "Name", type: "text" },
        { key: "url", label: "URL", type: "url" },
        { key: "icon", label: "Lucide icon name", type: "text", placeholder: "Facebook, Instagram, Linkedin, MessageCircle…" },
        { key: "sort_order", label: "Sort order", type: "number" },
        { key: "is_active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});
