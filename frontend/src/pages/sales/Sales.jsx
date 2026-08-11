import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../ui";

import SaleToolbar from "../../components/sales/SalesToolbar";
import SaleTable from "../../components/sales/SaleTable";
import SaleModal from "../../components/sales/SaleModal";
import SaleViewModal from "../../components/sales/SaleViewModal";

import Pagination from "../../ui/Pagination";

import { getSales } from "../../services/saleService";

export default function Sales() {
  const [modalOpen, setModalOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewSale, setViewSale] = useState(null);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalSales: 0,
    limit: 10,
  });

  async function loadSales(
    currentPage = page,
    keyword = search
  ) {
    try {
      setLoading(true);

      const response = await getSales(
        `?page=${currentPage}&limit=10&search=${encodeURIComponent(
          keyword
        )}`
      );

      setSales(response.data.sales || []);

      setPagination(
        response.data.pagination || {
          currentPage: currentPage,
          totalPages: 1,
          totalSales: 0,
          limit: 10,
        }
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Search with small delay
  useEffect(() => {
    const timer = setTimeout(() => {
      loadSales(1, search);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Page change
  useEffect(() => {
    if (page === 1) return;

    loadSales(page, search);
  }, [page]);

  function handleSearchChange(value) {
    setSearch(value);
    setPage(1);
  }

  function handleSaleCreated() {
    setModalOpen(false);

    // Refresh first page
    setPage(1);
    loadSales(1, search);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Sales</CardTitle>
        </CardHeader>

        <CardContent>
          <SaleToolbar
            search={search}
            onSearchChange={handleSearchChange}
            onAdd={() => setModalOpen(true)}
          />

          <SaleTable
            sales={sales}
            loading={loading}
            onView={setViewSale}
            onEdit={() => {}}
          />

          <Pagination
            page={pagination.currentPage}
            pages={pagination.totalPages}
            total={pagination.totalSales}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      <SaleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSaleCreated}
      />

      <SaleViewModal
        open={!!viewSale}
        sale={viewSale}
        onClose={() => setViewSale(null)}
      />
    </>
  );
}