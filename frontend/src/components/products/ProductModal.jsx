import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {Select} from "../../ui";
import { Modal } from "../../ui";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from "../../ui";

import { createProduct, updateProduct } from "../../services/productService";

export default function ProductModal({ open, onClose, onSuccess, product }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (product) {
      reset(product);
    } else {
      reset({
        name: "",
        sku: "",
        category: "",
        brand: "",
        costPrice: "",
        defaultSellingPrice: "",
        unit: "Carton",
        description: "",
      });
    }
  }, [product, reset]);

  async function onSubmit(values) {
    try {
      if (product) {
        await updateProduct(product._id, values);
        toast.success("Product updated");
      } else {
        await createProduct(values);
        toast.success("Product created");
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (!open) return null;

  return (
    <Modal
    open={open}
    onClose={onClose}
    title={
        product
            ? "Edit Product"
            : "Add Product"
    }
>

       <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{product ? "Edit Product" : "Add Product"}</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Input
              label="Product Name"
              error={errors.name?.message}
              {...register("name", {
                required: "Required",
              })}
            />

            <Input
              label="SKU"
              error={errors.sku?.message}
              {...register("sku", {
                required: "Required",
              })}
            />

            <Input
              label="Category"
              {...register("category", {
                required: "Required",
              })}
            />

            <Input
              label="Brand"
              {...register("brand", {
                required: "Required",
              })}
            />

            <Input
              label="Cost Price"
              type="number"
              {...register("costPrice", {
                required: "Required",
              })}
            />

            <Input
              label="Selling Price"
              type="number"
              {...register("defaultSellingPrice", {
                required: "Required",
              })}
            />

         

            <Select
              label="Unit"
              options={[
                {
                  value: "Bottle",
                  label: "Bottle",
                },
                {
                  value: "Can",
                  label: "Can",
                },
                {
                  value: "Pack",
                  label: "Pack",
                },
                {
                  value: "Carton",
                  label: "Carton",
                },
                {
                  value: "Case",
                  label: "Case",
                },
              ]}
              {...register("unit")}
            />

            <div className="md:col-span-2">
              <Input label="Description" {...register("description")} />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" loading={isSubmitting}>
              Save
            </Button>
          </CardFooter>
        </form>
      </Card>

      </Modal>
   );
}
