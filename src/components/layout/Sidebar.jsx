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
    label: "Reviews",
    path: "/reviews",
  },
]

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white">

      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Optocare
          </h1>

          <p className="text-xs text-slate-500">
            Administration
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">

        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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
  )
}

export default Sidebar

