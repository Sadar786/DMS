import { Button, Input } from "../../ui";

export default function StockEntryToolbar({
  search,
  onSearchChange,
  onAdd,
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <Input
        placeholder="Search invoice..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <Button onClick={onAdd}>
        + Stock Entry
      </Button>
    </div>
  );
}
