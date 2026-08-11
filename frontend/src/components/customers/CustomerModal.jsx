import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "../../ui/Modal";
import { Button, Input } from "../../ui";

import {
  createCustomer,
  updateCustomer,
} from "../../services/customerService";

export default function CustomerModal({
  open,
  customer,
  onClose,
  onSuccess,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    if (customer) {
      reset(customer);
    } else {
      reset({
        name: "",
        shopName: "",
        phone: "",
        address: "",
        openingBalance: 0,
      });
    }
  }, [customer]);

  async function onSubmit(data) {
    try {
      if (customer) {
        await updateCustomer(customer._id, data);
        toast.success("Customer updated");
      } else {
        await createCustomer(data);
        toast.success("Customer created");
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={customer ? "Edit Customer" : "Add Customer"}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Input
          label="Customer Name"
          {...register("name", { required: true })}
        />

        <Input
          label="Shop Name"
          {...register("shopName")}
        />

        <Input
          label="Phone"
          {...register("phone")}
        />

        <Input
          label="Address"
          {...register("address")}
        />

        <Input
          type="number"
          label="Opening Balance"
          {...register("openingBalance")}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={isSubmitting}
          >
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}