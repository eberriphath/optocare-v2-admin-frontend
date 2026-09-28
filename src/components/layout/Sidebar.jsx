import { NavLink } from "react-router-dom"

const navigation = [
  {
    label: "Overview",
    path: "/dashboard",
  },
  {
    label: "Applications",
    path: "/applications",
  },
  {
    label: "Partners",
    path: "/partners",
  },
  {
    label: "Services",
    path: "/services",
  },
  {
    label: "Products",
    path: "/products",
  },
  {
    label: "Clients",
    path: "/clients",
  },
  {
    label: "Prescriptions",
    path: "/prescriptions",
  },
  {
    label: "Orders",
    path: "/orders",
  },
  {
    label: "Reviews",
    path: "/reviews",
  },
]

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200  ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >

        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Optocare
            </h1>

            <p className="text-xs text-slate-500">
              Administration
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Close navigation"
          >
            ✕
          </button>

        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">

          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4">

          <p className="text-xs text-slate-400">
            Optocare Admin
          </p>

          <p className="mt-1 text-xs text-slate-400">
            v1.0
          </p>

        </div>

      </aside>
    </>
  )
}

export default Sidebar