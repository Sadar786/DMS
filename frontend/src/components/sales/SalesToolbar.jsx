import { FaPlus, FaMagnifyingGlass } from "react-icons/fa6";
import { Button, Input } from "../../ui";

export default function SaleToolbar({
  search,
  onSearchChange,
  onAdd,
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div className="w-full max-w-sm">
        <Input
          placeholder="Search invoice..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<FaMagnifyingGlass />}
        />
      </div>

      <Button onClick={onAdd}>
        <FaPlus />
        New Sale
      </Button>
    </div>
  );
}