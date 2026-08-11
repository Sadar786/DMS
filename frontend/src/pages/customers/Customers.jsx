// src/pages/customers/Customers.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Card, CardHeader, CardTitle, CardContent, Pagination } from "../../ui";

import CustomerToolbar from "../../components/customers/CustomerToolbar";
import CustomerTable from "../../components/customers/CustomerTable";
 import CustomerModal from "../../components/customers/CustomerModal";
import CustomerViewModal from "../../components/customers/CustomerViewModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import { getCustomers, deleteCustomer } from "../../services/customerService";

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [viewCustomer, setViewCustomer] = useState(null);

  const [deleteCustomerItem, setDeleteCustomerItem] = useState(null);

  const [deleting, setDeleting] = useState(false);

  function handleEdit(customer) {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  }

  function handleDelete(customer) {
    setDeleteCustomerItem(customer);
  }

  async function confirmDelete() {
    try {
      setDeleting(true);

      await deleteCustomer(deleteCustomerItem._id);

      toast.success("Customer deleted");

      setDeleteCustomerItem(null);

      loadCustomers(page, search);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  }

  async function loadCustomers(currentPage = page, keyword = search) {
    try {
      setLoading(true);

      const response = await getCustomers(
        `?page=${currentPage}&search=${encodeURIComponent(
          keyword,
        )}&isActive=true`,
      );

      setCustomers(response.data.customers);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCustomers(page, search);
    }, 300);

    return () => clearTimeout(timer);
  }, [page, search]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>

        <CardContent>
          <CustomerToolbar
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            onAdd={() => {
              setEditingCustomer(null);
              setIsModalOpen(true);
            }}
          />

          <CustomerTable
            customers={customers}
            loading={loading}
            onView={setViewCustomer}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onOpenLedger={(customer) =>
              navigate(`/customers/${customer._id}`)
            }
          />

          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            total={pagination.total}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      <CustomerModal
        open={isModalOpen}
        customer={editingCustomer}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadCustomers()}
      />

      <CustomerViewModal
        open={!!viewCustomer}
        customer={viewCustomer}
        onClose={() => setViewCustomer(null)}
      />

      <ConfirmDialog
        open={!!deleteCustomerItem}
        title="Delete Customer"
        message={
          deleteCustomerItem
            ? `Are you sure you want to delete "${deleteCustomerItem.name}"?`
            : ""
        }
        confirmText="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteCustomerItem(null)}
      />
    </>
  );
}
