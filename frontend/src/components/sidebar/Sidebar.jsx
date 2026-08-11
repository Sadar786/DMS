import { NavLink } from "react-router-dom";
import clsx from "clsx";
import navigation from "../../constants/navigation"
import { FaUsers } from "react-icons/fa6";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      {
        //logo
        <img src="https://www.google.com/search?q=pepsi+logo&oq=pepsi+logo&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIHCAgQABiABDIHCAkQABiABNIBCDQxMzFqMGo3qAIAsAIA&sourceid=chrome&source=chrome.ob&ie=UTF-8#sv=CAMSZxowKg5Sa0FiLTRZZkpEYi1rTTIOUmtBYi00WWZKRGIta006DnlwNnZxNVQwMmFZcFpNIAQqLwobXy1VMXphdk9fSTQySmtkVVB5T1B4NEFRXzQ2Eg5Sa0FiLTRZZkpEYi1rTRgAMAEYByDK3P1ySggQARgBIAEoAQ" alt="" />
      }
      <div className="border-b border-slate-200 p-6">
        <h1 className="text-xl font-bold text-primary-600">
          Pepsi DMS
        </h1>

        <p className="text-sm text-slate-500">
          Distribution System
        </p>
      </div>

      {/* Navigation */}
      

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-lg px-4 py-3 transition",
                  isActive
                    ? "bg-primary-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )
              }
            >
              <Icon size={18} />

              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}

      <div className="border-t border-slate-200 p-4">
        <p className="text-xs text-slate-400">
          Version 1.0
        </p>
      </div>
    </aside>
  );
}