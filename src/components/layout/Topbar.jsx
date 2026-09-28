import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

function Topbar({ setSidebarOpen }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 flex min-h-20 items-center  justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">

      {/* Left side */}
      <div className="flex items-center gap-3">

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          aria-label="Open navigation"
        >
          ☰
        </button>

        <div>
          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
            Admin Dashboard
          </h2>

          <p className="hidden text-sm text-slate-500 sm:block">
            Manage Optocare
          </p>
        </div>

      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4">

        <div className="hidden text-right md:block">

          <p className="text-sm font-medium text-slate-900">
            {user?.name || "Administrator"}
          </p>

          <p className="text-xs text-slate-500">
            Administrator
          </p>

        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700 sm:h-10 sm:w-10">
          {user?.name?.charAt(0)?.toUpperCase() || "A"}
        </div>

        <button
          type="button"
          onClick={() => navigate("/change-password")}
          className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:block"
        >
          Change Password
        </button>

        <button
          type="button"
          onClick={logout}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          Logout
        </button>

      </div>

    </header>
  )
}

export default Topbar