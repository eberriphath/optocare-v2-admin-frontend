import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Partners() {
  const navigate = useNavigate();

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await api.get("/admin/partners");

        setPartners(response.data.partners);
      } catch (error) {
        console.error("Failed to load partners:", error);

        setError(
          error.response?.data?.error ||
          "Unable to load partners."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading partners...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Partners
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage Optocare partners.
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            Unable to load partners
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
          Partners
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage and review registered Optocare partners.
        </p>
      </div>

      {/* Partners table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {partners.length === 0 ? (

          <div className="p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No partners yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Approved partner applications will appear here.
            </p>
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Partner
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Company
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Verification
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {partners.map((partner) => (

                  <tr
                    key={partner.id}
                    onClick={() =>
                      navigate(`/partners/${partner.id}`)
                    }
                    className="cursor-pointer transition hover:bg-slate-50"
                  >

                    <td className="px-6 py-4">

                      <p className="font-medium text-slate-900">
                        {partner.user?.name || "—"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {partner.user?.email || "—"}
                      </p>

                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {partner.company_name || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {partner.partner_type || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge
                        active={partner.user?.is_active}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <VerificationBadge
                        verified={partner.is_verified}
                      />
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
          : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function VerificationBadge({ verified }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        verified
          ? "bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-600/20"
          : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
      }`}
    >
      {verified ? "Verified" : "Unverified"}
    </span>
  );
}

export default Partners;