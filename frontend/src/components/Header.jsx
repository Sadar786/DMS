import { FaBell, FaMagnifyingGlass } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui";

export default function Header() {
  const user = localStorage.dms_token;
  const navigate = useNavigate();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Left */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>

        <p className="text-sm text-slate-500">Welcome back 👋</p>
      </div>

      {/* Middle */}
      <div className="flex-1 px-6">
        {!user && (
          <p className="text-center text-sm font-medium text-red-500">
            Please Login to access the system
          </p>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {user ? (
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        ) : (
          <button className="rounded-lg p-2 hover:bg-slate-100">
            <FaMagnifyingGlass />
          </button>
        )}

        <button className="rounded-lg p-2 hover:bg-slate-100">
          <FaBell />
        </button>

        <div
          className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-slate-100"
          onClick={() => navigate("/login")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 font-semibold text-white">
            A
          </div>

          <div>
            <p className="text-sm font-medium">Admin</p>

            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
