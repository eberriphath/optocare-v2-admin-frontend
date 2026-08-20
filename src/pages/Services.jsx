import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Services() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/admin/services");

        setServices(response.data.services);
      } catch (error) {
        console.error("Failed to load services:", error);

        setError(
          error.response?.data?.error ||
          "Unable to load services."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading services...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Services
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage services offered by Optocare partners.
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            Unable to load services
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Services
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage services offered by Optocare partners.
        </p>
      </div>

      {/* Services table */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {services.length === 0 ? (

          <div className="p-10 text-center">
            <p className="text-sm text-slate-500">
              No services have been added yet.
            </p>
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full divide-y divide-slate-200">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Service
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Partner
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">

                {services.map((service) => (

                  <tr
                    key={service.id}
                    className="cursor-pointer transition hover:bg-slate-50"
                    onClick={() =>
                      navigate(`/services/${service.id}`)
                    }
                  >

                    {/* Service */}
                    <td className="px-6 py-5">

                      <p className="font-medium text-slate-900">
                        {service.name}
                      </p>

                      <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                        {service.description || "No description"}
                      </p>

                    </td>

                    {/* Partner */}
                    <td className="px-6 py-5">

                      <p className="font-medium text-slate-900">
                        {service.partner?.user?.name || "—"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {service.partner?.user?.email || "—"}
                      </p>

                    </td>

                    {/* Category */}
                    <td className="px-6 py-5">

                      <span className="text-sm text-slate-700">
                        {service.category || "—"}
                      </span>

                    </td>

                    {/* Price */}
                    <td className="px-6 py-5">

                      <span className="text-sm font-medium text-slate-800">
                        {service.price !== null &&
                        service.price !== undefined
                          ? `KES ${Number(service.price).toLocaleString()}`
                          : "Not specified"}
                      </span>

                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">

                      <StatusBadge
                        active={service.is_active}
                      />

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
          : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default Services;