import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductModal from "../../components/products/ProductModal";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../ui";
import ProductToolbar from "../../components/products/ProductToolbar";
import { getProducts } from "../../services/productService";
import { deleteProduct } from "../../services/productService";
import ProductTable from "../../components/products/ProductTable";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { Pagination } from "../../ui";
import ProductViewModal from "../../components/products/ProductViewModal";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProductItem, setDeleteProductItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [viewProduct, setViewProduct] = useState(null);
 
  function handleEdit(product) {
    setEditingProduct(product);
    setIsModalOpen(true);
  }

  function handleDelete(product) {
    setDeleteProductItem(product);
  }

  async function confirmDelete() {
    try {
      setDeleting(true);

      await deleteProduct(deleteProductItem._id);

      toast.success("Product deleted");

      setDeleteProductItem(null);

      loadProducts(page, search);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  }

  async function loadProducts(currentPage = page, keyword = search) {
    try {
      setLoading(true);

      const response = await getProducts(
        `?page=${currentPage}&search=${encodeURIComponent(keyword)}&isActive=true`,
      );

      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts(page, search);
    }, 300);

    return () => clearTimeout(timer);
  }, [page, search]);

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductToolbar
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            onAdd={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
          />

          <ProductTable
            products={products}
            loading={loading}
            onView={setViewProduct}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            total={pagination.total}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      <ProductModal
        open={isModalOpen}
        product={editingProduct}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadProducts()}
      />

      <ProductViewModal
        open={!!viewProduct}
        product={viewProduct}
        onClose={() => setViewProduct(null)}
      />
      <ConfirmDialog
        open={!!deleteProductItem}
        title="Delete Product"
        message={
          deleteProductItem
            ? `Are you sure you want to delete "${deleteProductItem.name}"?`
            : ""
        }
        confirmText="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteProductItem(null)}
      />
    </>
  );
}
