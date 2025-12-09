"use client";
import { useEffect, useState } from "react";
import Button from "../ReuseableComponenets/Button";
import { useProfileStore } from "@/lib/stores/profileStore";
import { userApi } from "@/lib/api/user";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Yup validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  delivery_address: yup.string().required("Address is required"),
});

const EditModal = ({ address, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: address?.name || "",
      delivery_address: address?.delivery_address || "",
    },
  });

  useEffect(() => {
    reset({
      name: address?.name || "",
      delivery_address: address?.delivery_address || "",
    });
  }, [address, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("delivery_address", data.delivery_address);

    try {
      await userApi.updateDeliveryAddress(address.id, formData);
      toast.success("Address updated successfully!");
      onSave(); // Refresh
      onClose(); // Close modal
    } catch (err) {
      toast.error("Failed to update address");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-md">
        <button onClick={onClose} className="absolute right-4 top-3 text-2xl font-bold text-gray-500">×</button>
        <h2 className="text-xl font-semibold text-center mb-4">Edit Delivery Address</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              {...register("name")}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Delivery Address</label>
            <textarea
              rows={3}
              {...register("delivery_address")}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />
            {errors.delivery_address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.delivery_address.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const hideComponent = useProfileStore((state) => state.hideComponent);

  const refreshAddresses = async () => {
    try {
      const res = await userApi.getDeliveryAddress();
      if (res?.success) {
        const formatted = res.data.map((addr) => ({
          ...addr,
          addressLines: addr.delivery_address.split(",").map((line) => line.trim()),
        }));
        setAddresses(formatted);
      }
    } catch (error) {
      toast.error("Failed to fetch delivery addresses.");
      console.error("Error fetching delivery addresses:", error);
    }
  };

  useEffect(() => {
    refreshAddresses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      await userApi.deleteDeliveryAddress(id);
      toast.success("Address deleted successfully");
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      toast.error("Failed to delete address");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="p-4 -mt-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses.length === 0 ? (
  <div className="col-span-full text-center text-gray-500 text-lg py-10">
    No delivery address found.
  </div>
) : ( addresses.map((address) => (
          <div
            key={address.id}
            className="border border-gray-300 rounded-md p-4 shadow-sm bg-white"
          >
            <h3 className="font-semibold mb-2">{address.name}</h3>
            <div className="text-sm text-gray-700 space-y-0.5">
              {address.addressLines.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
            <p className="flex gap-2 text-sm text-gray-600 mt-2">
              <button
                onClick={() => setEditingAddress(address)}
                className="text-green-500 underline cursor-pointer"
              >
                Edit
              </button>
              |
              <button
                onClick={() => handleDelete(address.id)}
                className="text-red-500 underline cursor-pointer"
              >
                Delete
              </button>
            </p>
          </div>
        )))}
      </div>
      <Button type="button" onClick={hideComponent} className="mt-10 ml-10">
        Go Back
      </Button>

      {/* Modal */}
      {editingAddress && (
        <EditModal
          address={editingAddress}
          onClose={() => setEditingAddress(null)}
          onSave={refreshAddresses}
        />
      )}
    </div>
  );
};

export default AddressList;
