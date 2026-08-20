import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(
          `/admin/services/${id}`
        );

        setService(response.data.service);
      } catch (error) {
        console.error("Failed to load service:", error);

        setError(
          error.response?.data?.error ||
          "Unable to load service."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

    const handleStatusChange = async () => {
    if (!service) {
      return;
    }

    const currentlyActive = service.is_active;

    const confirmed = window.confirm(
      currentlyActive
        ? "Are you sure you want to deactivate this service?"
        : "Are you sure you want to activate this service?"
    );

    if (!confirmed) {
      return;
    }

    setUpdatingStatus(true);
    setError("");

    try {
      const response = await api.patch(
        `/admin/services/${id}/status`,
        {
          is_active: !currentlyActive,
        }
      );

      setService((current) => ({
        ...current,
        is_active: response.data.service.is_active,
      }));
    } catch (error) {
      console.error(
        "Failed to update service status:",
        error
      );

      setError(
        error.response?.data?.error ||
        "Unable to update service status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading service...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">

        <button
          onClick={() => navigate("/services")}
          className="text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          ← Back to services
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            Unable to load service
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        </div>

      </div>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div>

          <button
            onClick={() => navigate("/services")}
            className="mb-4 text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            ← Back to services
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            Service Details
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View information about this service.
          </p>

        </div>

        <StatusBadge active={service.is_active} />

      </div>

            {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* Service information */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Service Information
          </h2>

        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">

          <InfoItem
            label="Service Name"
            value={service.name}
          />

          <InfoItem
            label="Category"
            value={service.category}
          />

          <InfoItem
            label="Price"
            value={
              service.price !== null
                ? service.price
                : "Not specified"
            }
          />

          <InfoItem
            label="Status"
            value={
              service.is_active
                ? "Active"
                : "Inactive"
            }
          />

        </div>

      </section>

      {/* Description */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Description
          </h2>

        </div>

        <div className="p-6">

          <p className="text-sm leading-7 text-slate-700">
            {service.description || "No description provided."}
          </p>

        </div>

      </section>

      {/* Partner information */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Service Provider
          </h2>

        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">

          <InfoItem
            label="Name"
            value={service.partner?.user?.name}
          />

          <InfoItem
            label="Email"
            value={service.partner?.user?.email}
          />

          <InfoItem
            label="Company"
            value={service.partner?.company_name}
          />

          <InfoItem
            label="Partner Type"
            value={service.partner?.partner_type}
          />

        </div>

      </section>

      {/* Dates */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Service History
          </h2>

        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">

          <InfoItem
            label="Created"
            value={formatDate(service.created_at)}
          />

          <InfoItem
            label="Last Updated"
            value={formatDate(service.updated_at)}
          />

        </div>

          </section>

      {/* Service status controls */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Service Status
          </h2>

        </div>

        <div className="p-6">

          <button
            onClick={handleStatusChange}
            disabled={updatingStatus}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              service.is_active
                ? "bg-red-600 hover:bg-red-700"
                : "bg-teal-700 hover:bg-teal-800"
            }`}
          >
            {updatingStatus
              ? "Updating..."
              : service.is_active
                ? "Deactivate Service"
                : "Activate Service"}
          </button>

        </div>

      </section>

    </div>
  );
}


function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm text-slate-800">
        {value || "—"}
      </p>
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

function formatDate(date) {
  return new Date(date).toLocaleString();
}

export default ServiceDetails;