import { FaPlus, FaMagnifyingGlass } from "react-icons/fa6";

import { Button, Input } from "../../ui";

export default function ProductToolbar({
  search,
  onSearchChange,
  onAdd,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="w-full max-w-md">
        <Input
          placeholder="Search by SKU, Product or Category..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<FaMagnifyingGlass />}
        />
      </div>

      <Button
        leftIcon={<FaPlus />}
        onClick={onAdd}
      >
        Add Product
      </Button>
    </div>
  );
}