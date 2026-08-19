function Dashboard() {
  const statistics = [
    {
      label: "Pending Applications",
      value: "0",
    },
    {
      label: "Active Partners",
      value: "0",
    },
    {
      label: "Services",
      value: "0",
    },
    {
      label: "Products",
      value: "0",
    },
  ]

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Overview
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here's what's happening with Optocare.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {statistics.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-slate-500">
              {stat.label}
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}

      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="text-lg font-semibold text-slate-900">
          Welcome to Optocare
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          From here you can review partner applications, manage
          partners, moderate reviews, and manage the services and
          products available on the Optocare platform.
        </p>

      </div>

    </div>
  )
}

export default Dashboard