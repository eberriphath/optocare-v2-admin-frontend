import { useAuth } from "../../context/AuthContext"

function Topbar() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">

      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Admin Dashboard
        </h2>

        <p className="text-sm text-slate-500">
          Manage Optocare
        </p>
      </div>

      <div className="flex items-center gap-4">

        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">
            {user?.name || "Administrator"}
          </p>

          <p className="text-xs text-slate-500">
            Administrator
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 font-semibold text-teal-700">
          {user?.name?.charAt(0)?.toUpperCase() || "A"}
        </div>

        <button
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