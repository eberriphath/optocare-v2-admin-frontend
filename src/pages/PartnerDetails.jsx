import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function PartnerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingVerification, setUpdatingVerification] = useState(false);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const response = await api.get(
          `/admin/partners/${id}`
        );

        setPartner(response.data.partner);
      } catch (error) {
        console.error("Failed to load partner:", error);

        setError(
          error.response?.data?.error ||
          "Unable to load partner."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [id]);

  // ---------------------------------------------------------
  // Activate / Deactivate
  // ---------------------------------------------------------

  const handleStatusChange = async () => {
    if (!partner?.user) {
      return;
    }

    const currentlyActive = partner.user.is_active;

    const confirmed = window.confirm(
      currentlyActive
        ? "Are you sure you want to deactivate this partner?"
        : "Are you sure you want to activate this partner?"
    );

    if (!confirmed) {
      return;
    }

    setUpdatingStatus(true);
    setError("");

    try {
      const response = await api.patch(
        `/admin/partners/${id}/status`,
        {
          is_active: !currentlyActive,
        }
      );

      setPartner((current) => ({
        ...current,
        user: {
          ...current.user,
          is_active: response.data.partner.user.is_active,
        },
      }));
    } catch (error) {
      console.error(
        "Failed to update partner status:",
        error
      );

      setError(
        error.response?.data?.error ||
        "Unable to update partner status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ---------------------------------------------------------
  // Verify / Unverify
  // ---------------------------------------------------------

  const handleVerificationChange = async () => {
    const currentlyVerified = partner.is_verified;

    const confirmed = window.confirm(
      currentlyVerified
        ? "Are you sure you want to remove this partner's verification?"
        : "Are you sure you want to verify this partner?"
    );

    if (!confirmed) {
      return;
    }

    setUpdatingVerification(true);
    setError("");

    try {
      const response = await api.patch(
        `/admin/partners/${id}/verification`,
        {
          is_verified: !currentlyVerified,
        }
      );

      setPartner((current) => ({
        ...current,
        is_verified: response.data.partner.is_verified,
      }));
    } catch (error) {
      console.error(
        "Failed to update partner verification:",
        error
      );

      setError(
        error.response?.data?.error ||
        "Unable to update partner verification."
      );
    } finally {
      setUpdatingVerification(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading partner...
        </p>
      </div>
    );
  }

  if (error && !partner) {
    return (
      <div className="space-y-6">

        <button
          onClick={() => navigate("/partners")}
          className="text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          ← Back to partners
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            Unable to load partner
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        </div>

      </div>
    );
  }

  if (!partner) {
    return null;
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div>

          <button
            onClick={() => navigate("/partners")}
            className="mb-4 text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            ← Back to partners
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            Partner Details
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View information about this Optocare partner.
          </p>

        </div>

        <VerificationBadge
          verified={partner.is_verified}
        />

      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* Partner information */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Partner Information
          </h2>

        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">

          <InfoItem
            label="Name"
            value={partner.user?.name}
          />

          <InfoItem
            label="Email"
            value={partner.user?.email}
          />

          <InfoItem
            label="Company"
            value={partner.company_name}
          />

          <InfoItem
            label="Partner Type"
            value={partner.partner_type}
          />

          <InfoItem
            label="Location"
            value={partner.location}
          />

          <InfoItem
            label="Specialty"
            value={partner.specialty}
          />

        </div>

      </section>

      {/* Partner description */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Description
          </h2>

        </div>

        <div className="p-6">

          <p className="text-sm leading-7 text-slate-700">
            {partner.description || "No description provided."}
          </p>

        </div>

      </section>

      {/* Account status */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Account Status
          </h2>

        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">

          <InfoItem
            label="Account Status"
            value={
              partner.user?.is_active
                ? "Active"
                : "Inactive"
            }
          />

          <InfoItem
            label="Verification"
            value={
              partner.is_verified
                ? "Verified"
                : "Unverified"
            }
          />

        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 border-t border-slate-200 px-6 py-5">

          {/* Activate / Deactivate */}
          <button
            onClick={handleStatusChange}
            disabled={updatingStatus || updatingVerification}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              partner.user?.is_active
                ? "bg-red-600 hover:bg-red-700"
                : "bg-teal-700 hover:bg-teal-800"
            }`}
          >
            {updatingStatus
              ? "Updating..."
              : partner.user?.is_active
                ? "Deactivate Account"
                : "Activate Account"}
          </button>

          {/* Verify / Unverify */}
          <button
            onClick={handleVerificationChange}
            disabled={updatingStatus || updatingVerification}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
              partner.is_verified
                ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                : "bg-teal-700 text-white hover:bg-teal-800"
            }`}
          >
            {updatingVerification
              ? "Updating..."
              : partner.is_verified
                ? "Remove Verification"
                : "Verify Partner"}
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

export default PartnerDetails;