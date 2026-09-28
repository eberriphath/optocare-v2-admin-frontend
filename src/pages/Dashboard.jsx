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
          error.response?.data?.message ||
          "Unable to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatStatus = (status) => {
    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

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

  const platformCards = [
    {
      label: "Total Users",
      value: statistics.total_users,
    },
    {
      label: "Total Partners",
      value: statistics.total_partners,
    },
    {
      label: "Active Partners",
      value: statistics.active_partners,
    },
    {
      label: "Verified Partners",
      value: statistics.verified_partners,
    },
    {
      label: "Pending Applications",
      value: statistics.pending_applications,
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
      label: "Pending Reviews",
      value: statistics.pending_reviews,
    },
  ];

  const opticalCards = [
    {
      label: "Clients",
      value: statistics.total_clients,
    },
    {
      label: "Prescriptions",
      value: statistics.total_prescriptions,
    },
    {
      label: "Total Orders",
      value: statistics.total_orders,
    },
    {
      label: "Unassigned Orders",
      value: statistics.unassigned_orders,
    },
  ];

  const orderStatuses = [
    "submitted",
    "under_review",
    "confirmed",
    "processing",
    "ready",
    "completed",
  ];

  const orderStatusValues = {
    submitted: statistics.submitted_orders,
    under_review: statistics.under_review_orders,
    confirmed: statistics.confirmed_orders,
    processing: statistics.processing_orders,
    ready: statistics.ready_orders,
    completed: statistics.completed_orders,
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Overview
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here's what's happening with Optocare.
        </p>
      </div>

      {/* Platform Overview */}
      <section>

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Platform Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Core Optocare platform statistics.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {platformCards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-slate-500">
                {card.label}
              </p>

              <p className="mt-3 text-3xl font-bold text-slate-900">
                {card.value ?? 0}
              </p>
            </div>
          ))}

        </div>

      </section>

      {/* Optical Operations */}
      <section>

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Optical Operations
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Clients, prescriptions, and glasses orders.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {opticalCards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-slate-500">
                {card.label}
              </p>

              <p className="mt-3 text-3xl font-bold text-slate-900">
                {card.value ?? 0}
              </p>
            </div>
          ))}

        </div>

      </section>

      {/* Order Pipeline */}
      <section>

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Order Pipeline
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current distribution of glasses orders by status.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {orderStatuses.map((status) => (
              <div
                key={status}
                className="rounded-lg border border-slate-100 bg-slate-50 p-5"
              >
                <p className="text-sm font-medium text-slate-500">
                  {formatStatus(status)}
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {orderStatusValues[status] ?? 0}
                </p>
              </div>
            ))}

          </div>

          <div className="mt-6 flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 px-5 py-4">

            <div>
              <p className="text-sm font-semibold text-amber-900">
                Unassigned Orders
              </p>

              <p className="mt-1 text-xs text-amber-700">
                Orders that have not yet been assigned to a partner.
              </p>
            </div>

            <p className="text-2xl font-bold text-amber-900">
              {statistics.unassigned_orders ?? 0}
            </p>

          </div>

        </div>

      </section>

      {/* Welcome */}
      <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="text-lg font-semibold text-slate-900">
          Welcome to Optocare
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          From here you can manage partner applications, partners,
          services, products, reviews, clients, prescriptions, and
          glasses orders across the Optocare platform.
        </p>

      </section>

    </div>
  );
}

export default Dashboard;
