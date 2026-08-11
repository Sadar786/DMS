// src/components/customers/CustomerToolbar.jsx

import { FaPlus, FaMagnifyingGlass } from "react-icons/fa6";

import { Button, Input } from "../../ui";

export default function CustomerToolbar({
  search,
  onSearchChange,
  onAdd,
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="w-full md:max-w-sm">
        <Input
          placeholder="Search customer..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<FaMagnifyingGlass />}
        />
      </div>

      <Button leftIcon={<FaPlus />} onClick={onAdd}>
        Add Customer
      </Button>
    </div>
  );
}