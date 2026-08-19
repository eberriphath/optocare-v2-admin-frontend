import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await api.get(
          `/admin/applications/${id}`
        );

        setApplication(response.data.application);
      } catch (error) {
        console.error(
          "Failed to load application:",
          error
        );

        setError(
          error.response?.data?.error ||
          "Unable to load application."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  // ---------------------------------------------------------
  // APPROVE APPLICATION
  // ---------------------------------------------------------

  const handleApprove = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this application?"
    );

    if (!confirmed) {
      return;
    }

    setApproving(true);
    setError("");

    try {
      const response = await api.patch(
        `/admin/applications/${id}/approve`
      );

      setApplication((current) => ({
        ...current,
        status: response.data.application.status,
        reviewed_by:
          response.data.user?.id ||
          current.reviewed_by,
        reviewed_at: new Date().toISOString(),
        review_notes: null,
      }));
    } catch (error) {
      console.error(
        "Failed to approve application:",
        error
      );

      setError(
        error.response?.data?.error ||
        "Unable to approve application."
      );
    } finally {
      setApproving(false);
    }
  };

  // ---------------------------------------------------------
  // REJECT APPLICATION
  // ---------------------------------------------------------

  const handleReject = async (event) => {
    event.preventDefault();

    if (!reviewNotes.trim()) {
      setError(
        "Please provide a reason for rejecting this application."
      );

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reject this application?"
    );

    if (!confirmed) {
      return;
    }

    setRejecting(true);
    setError("");

    try {
      const response = await api.patch(
        `/admin/applications/${id}/reject`,
        {
          review_notes: reviewNotes.trim(),
        }
      );

      setApplication((current) => ({
        ...current,
        status: response.data.application.status,
        reviewed_by:
          response.data.application.reviewed_by,
        reviewed_at:
          response.data.application.reviewed_at,
        review_notes:
          response.data.application.review_notes,
      }));

      setShowRejectForm(false);
      setReviewNotes("");
    } catch (error) {
      console.error(
        "Failed to reject application:",
        error
      );

      setError(
        error.response?.data?.error ||
        "Unable to reject application."
      );
    } finally {
      setRejecting(false);
    }
  };

  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading application...
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------
  // ERROR
  // ---------------------------------------------------------

  if (error && !application) {
    return (
      <div className="space-y-6">

        <button
          onClick={() => navigate("/applications")}
          className="text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          ← Back to applications
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            Unable to load application
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        </div>

      </div>
    );
  }

  if (!application) {
    return null;
  }

  const isPending = application.status === "pending";

  return (
    <div className="space-y-8">

      {/* ---------------------------------------------------
          HEADER
      --------------------------------------------------- */}

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <button
            onClick={() => navigate("/applications")}
            className="mb-4 text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            ← Back to applications
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            Application Details
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review the partner application submitted to
            Optocare.
          </p>

        </div>

        <StatusBadge status={application.status} />

      </div>

      {/* ---------------------------------------------------
          ACTION ERROR
      --------------------------------------------------- */}

      {error && application && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* ---------------------------------------------------
          ADMIN ACTIONS
      --------------------------------------------------- */}

      {isPending && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="font-semibold text-slate-900">
                Application Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Approve this applicant as a partner or reject
                the application.
              </p>
            </div>

            <div className="flex gap-3">

              <button
                onClick={handleApprove}
                disabled={approving || rejecting}
                className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {approving
                  ? "Approving..."
                  : "Approve Application"}
              </button>

              <button
                onClick={() => {
                  setError("");
                  setShowRejectForm(true);
                }}
                disabled={approving || rejecting}
                className="rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reject Application
              </button>

            </div>

          </div>

        </section>
      )}

      {/* ---------------------------------------------------
          REJECTION FORM
      --------------------------------------------------- */}

      {showRejectForm && isPending && (
        <section className="rounded-xl border border-red-200 bg-red-50 p-6">

          <div className="mb-5">

            <h2 className="text-lg font-semibold text-red-900">
              Reject Application
            </h2>

            <p className="mt-1 text-sm text-red-700">
              Please provide a reason for rejecting this
              application. This will be recorded in the
              application review.
            </p>

          </div>

          <form onSubmit={handleReject}>

            <label
              htmlFor="review-notes"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Reason for rejection
            </label>

            <textarea
              id="review-notes"
              value={reviewNotes}
              onChange={(event) =>
                setReviewNotes(event.target.value)
              }
              rows={5}
              required
              placeholder="Explain why this application is being rejected..."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />

            <div className="mt-4 flex gap-3">

              <button
                type="submit"
                disabled={rejecting || !reviewNotes.trim()}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {rejecting
                  ? "Rejecting..."
                  : "Confirm Rejection"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowRejectForm(false);
                  setReviewNotes("");
                  setError("");
                }}
                disabled={rejecting}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

            </div>

          </form>

        </section>
      )}

      {/* ---------------------------------------------------
          APPLICANT INFORMATION
      --------------------------------------------------- */}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Applicant Information
          </h2>

        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">

          <InfoItem
            label="Full Name"
            value={application.full_name}
          />

          <InfoItem
            label="Position"
            value={application.position}
          />

          <InfoItem
            label="Email"
            value={application.email}
          />

          <InfoItem
            label="Phone"
            value={application.phone}
          />

        </div>

      </section>

      {/* ---------------------------------------------------
          COMPANY INFORMATION
      --------------------------------------------------- */}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Company Information
          </h2>

        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">

          <InfoItem
            label="Company Name"
            value={application.company_name}
          />

          <InfoItem
            label="Partner Type"
            value={application.partner_type}
          />

          <div className="sm:col-span-2">

            <InfoItem
              label="Services Offered"
              value={application.services_offered}
            />

          </div>

        </div>

      </section>

      {/* ---------------------------------------------------
          DOCUMENTS
      --------------------------------------------------- */}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Submitted Documents
          </h2>

        </div>

        <div className="p-6">

          {application.document_path ? (

            <a
              href={application.document_path}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-800"
            >
              View Document
            </a>

          ) : (

            <p className="text-sm text-slate-500">
              No document was submitted.
            </p>

          )}

        </div>

      </section>

      {/* ---------------------------------------------------
          REVIEW INFORMATION
      --------------------------------------------------- */}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Application Review
          </h2>

        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">

          <InfoItem
            label="Status"
            value={application.status}
          />

          <InfoItem
            label="Submitted"
            value={formatDate(application.created_at)}
          />

          <InfoItem
            label="Reviewed At"
            value={
              application.reviewed_at
                ? formatDate(application.reviewed_at)
                : "Not reviewed"
            }
          />

          <InfoItem
            label="Reviewed By"
            value={
              application.reviewed_by || "Not reviewed"
            }
          />

          {application.review_notes && (
            <div className="sm:col-span-2">

              <InfoItem
                label="Review Notes"
                value={application.review_notes}
              />

            </div>
          )}

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

function formatDate(date) {
  return new Date(date).toLocaleString();
}

export default ApplicationDetails;