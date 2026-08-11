import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from "../../ui";

export default function ProductViewModal({
  open,
  product,
  onClose,
}) {
  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-5">

            <Info
              label="SKU"
              value={product.sku}
            />

            <Info
              label="Name"
              value={product.name}
            />

            <Info
              label="Category"
              value={product.category}
            />

            <Info
              label="Brand"
              value={product.brand}
            />

            <Info
              label="Cost Price"
              value={`Rs ${product.costPrice}`}
            />

            <Info
              label="Selling Price"
              value={`Rs ${product.defaultSellingPrice}`}
            />

            <Info
              label="Current Stock"
              value={product.currentStock}
            />

            <Info
              label="Minimum Stock"
              value={product.minimumStock}
            />

            <div>
              <p className="mb-1 text-sm text-slate-500">
                Status
              </p>

              <Badge
                variant={
                  product.isActive
                    ? "success"
                    : "danger"
                }
              >
                {product.isActive
                  ? "Active"
                  : "Inactive"}
              </Badge>
            </div>

            <div className="col-span-2">
              <p className="mb-1 text-sm text-slate-500">
                Description
              </p>

              <p>
                {product.description || "-"}
              </p>
            </div>

          </div>
        </CardContent>

        <CardFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-sm text-slate-500">
        {label}
      </p>

      <p className="font-medium">
        {value}
      </p>
    </div>
  );
}