import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/admin/applications");

        setApplications(response.data.applications);
      } catch (error) {
        console.error("Failed to load applications:", error);

        setError(
          error.response?.data?.error ||
          "Unable to load applications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading applications...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">
          Unable to load applications
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Applications
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Review and manage partner applications.
        </p>
      </div>

      {/* Applications table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="border-b border-slate-200 bg-slate-50">

              <tr>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Applicant
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Company
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Partner Type
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Submitted
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {applications.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No applications found.
                  </td>

                </tr>

              ) : (

                applications.map((application) => (

                  <tr
                    key={application.id}
                    onClick={() => navigate(`/applications/${application.id}`)}
                    className="cursor-pointer transition hover:bg-slate-50"
                  >

                    <td className="px-6 py-4">

                      <p className="font-medium text-slate-900">
                        {application.full_name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {application.position}
                      </p>

                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {application.company_name}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {application.partner_type}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {application.email}
                    </td>

                    <td className="px-6 py-4">

                      <StatusBadge
                        status={application.status}
                      />

                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(
                        application.created_at
                      ).toLocaleDateString()}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending:
      "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",

    approved:
      "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",

    rejected:
      "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

export default Applications;