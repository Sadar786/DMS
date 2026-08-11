import { FaBell, FaMagnifyingGlass } from "react-icons/fa6";

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Left */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Dashboard
        </h1>

        <p className="text-sm text-slate-500">
          Welcome back 👋
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 hover:bg-slate-100">
          <FaMagnifyingGlass />
        </button>

        <button className="rounded-lg p-2 hover:bg-slate-100">
          <FaBell />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 font-semibold text-white">
            A
          </div>

          <div>
            <p className="text-sm font-medium">
              Admin
            </p>

            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}