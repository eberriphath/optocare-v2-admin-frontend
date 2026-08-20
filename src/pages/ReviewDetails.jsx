import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function ReviewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await api.get(
          `/admin/reviews/${id}`
        );

        setReview(response.data.review);
      } catch (error) {
        console.error("Failed to load review:", error);

        setError(
          error.response?.data?.error ||
          "Unable to load review."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading review...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">

        <button
          onClick={() => navigate("/reviews")}
          className="text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          ← Back to reviews
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            Unable to load review
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        </div>

      </div>
    );
  }

  if (!review) {
    return null;
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div>

          <button
            onClick={() => navigate("/reviews")}
            className="mb-4 text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            ← Back to reviews
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            Review Details
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View information about this review.
          </p>

        </div>

        <ReviewStatus
          approved={review.is_approved}
        />

      </div>

      {/* Review */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Review
          </h2>

        </div>

        <div className="space-y-6 p-6">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Rating
            </p>

            <Rating rating={review.rating} />

          </div>

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Comment
            </p>

            <p className="mt-2 text-sm leading-7 text-slate-700">
              {review.comment || "No comment provided."}
            </p>

          </div>

        </div>

      </section>

      {/* Reviewer information */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Reviewer Information
          </h2>

        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">

          <InfoItem
            label="Name"
            value={review.reviewer_name}
          />

          <InfoItem
            label="Email"
            value={review.reviewer_email}
          />

          <InfoItem
            label="User ID"
            value={review.user_id}
          />

        </div>

      </section>

      {/* Partner information */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Reviewed Partner
          </h2>

        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">

          <InfoItem
            label="Partner ID"
            value={review.partner_id}
          />

        </div>

      </section>

      {/* Admin notes */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Admin Notes
          </h2>

        </div>

        <div className="p-6">

          <p className="text-sm leading-7 text-slate-700">
            {review.admin_notes || "No admin notes."}
          </p>

        </div>

      </section>

      {/* Review history */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Review History
          </h2>

        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">

          <InfoItem
            label="Created"
            value={formatDate(review.created_at)}
          />

          <InfoItem
            label="Last Updated"
            value={formatDate(review.updated_at)}
          />

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

function Rating({ rating }) {
  return (
    <div className="mt-2 flex items-center gap-3">

      <span className="font-medium text-slate-800">
        {rating}/5
      </span>

      <span className="text-lg text-amber-500">
        {"★".repeat(
          Math.max(0, Math.min(5, rating || 0))
        )}
      </span>

    </div>
  );
}

function ReviewStatus({ approved }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        approved
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
          : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
      }`}
    >
      {approved ? "Approved" : "Pending"}
    </span>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleString();
}

export default ReviewDetails;