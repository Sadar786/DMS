import { Card, CardHeader, CardTitle, CardContent } from "../../ui";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import {getStock } from "../../services/stockEntryService";
import StockEntryToolbar from "../../components/stockEntries/StockEntryToolbar";
import StockEntryModal from "../../components/stockEntries/StockEntryModal";
import StockEntryTable from "../../components/stockEntries/StockEntryTable";
import Pagination from "../../ui/Pagination";
import StockEntryViewModal from "../../components/stockEntries/StockEntryViewModal";

export default function StockEntries() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [stockEntries, setStockEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const [viewEntry, setViewEntry] = useState(null);

  async function loadStockEntries(
    currentPage = page,
    keyword = search
  ) {
    try {
      setLoading(true);

      const response = await getStock(
        `?page=${currentPage}&search=${encodeURIComponent(keyword)}`
      );

      setStockEntries(response.data.stockEntries);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStockEntries(page, search);
    }, 300);

    return () => clearTimeout(timer);
  }, [page, search]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Stock Entries</CardTitle>
        </CardHeader>

        <CardContent>
          <StockEntryToolbar
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            onAdd={() => setModalOpen(true)}
          />

          <StockEntryTable
            entries={stockEntries}
            loading={loading}
            onView={setViewEntry}
          />

          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            total={pagination.total}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      <StockEntryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => loadStockEntries(page, search)}
      />

      <StockEntryViewModal
        open={!!viewEntry}
        entry={viewEntry}
        onClose={() => setViewEntry(null)}
      />
    </>
  );
}