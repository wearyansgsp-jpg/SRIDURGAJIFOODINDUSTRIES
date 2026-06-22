import { createFileRoute } from "@tanstack/react-router";
import { CrudPanel } from "@/components/admin/CrudPanel";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: () => (
    <CrudPanel
      table="products" title="Products" description="Maida, Suji, Atta, Wheat Bran and other SKUs."
      listColumns={[
        { key: "name", label: "Name" },
        { key: "rate", label: "Rate" },
        { key: "sort_order", label: "Order" },
        { key: "is_active", label: "Active" },
      ]}
      defaultValues={{ sort_order: 0, is_active: true, usps: [], ingredients: [] }}
      fields={[
        { key: "name", label: "Name", type: "text", required: true },
        { key: "rate", label: "Rate (e.g. ₹38 / kg)", type: "text" },
        { key: "image", label: "Image URL", type: "url" },
        { key: "usps", label: "USPs", type: "array", placeholder: "Double-sifted, Bakery grade" },
        { key: "ingredients", label: "Ingredients / Details", type: "array" },
        { key: "sort_order", label: "Sort order", type: "number" },
        { key: "is_active", label: "Active", type: "boolean" },
      ]}
    />
  ),
});
