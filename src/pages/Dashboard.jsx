import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/admin/dashboard");

        setStatistics(response.data.statistics);
      } catch (error) {
        console.error("Failed to load dashboard:", error);

        setError(
          error.response?.data?.error ||
          "Unable to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">
          Unable to load dashboard
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  const cards = [
    {
      label: "Pending Applications",
      value: statistics.pending_applications,
    },
    {
      label: "Active Partners",
      value: statistics.active_partners,
    },
    {
      label: "Services",
      value: statistics.total_services,
    },
    {
      label: "Products",
      value: statistics.total_products,
    },
    {
      label: "Total Partners",
      value: statistics.total_partners,
    },
    {
      label: "Verified Partners",
      value: statistics.verified_partners,
    },
    {
      label: "Pending Reviews",
      value: statistics.pending_reviews,
    },
    {
      label: "Total Users",
      value: statistics.total_users,
    },
  ];

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

        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-slate-500">
              {card.label}
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {card.value}
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
  );
}

export default Dashboard;