import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Reviews() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingReview, setUpdatingReview] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get("/admin/reviews");

        setReviews(response.data.reviews);
      } catch (error) {
        console.error("Failed to load reviews:", error);

        setError(
          error.response?.data?.error ||
          "Unable to load reviews."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleModeration = async (reviewId, approved) => {
    const action = approved ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this review?`
    );

    if (!confirmed) {
      return;
    }

    setUpdatingReview(reviewId);
    setError("");

    try {
      const response = await api.patch(
        `/admin/reviews/${reviewId}`,
        {
          is_approved: approved,
        }
      );

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                is_approved:
                  response.data.review.is_approved,
              }
            : review
        )
      );
    } catch (error) {
      console.error(
        `Failed to ${action} review:`,
        error
      );

      setError(
        error.response?.data?.error ||
        `Unable to ${action} review.`
      );
    } finally {
      setUpdatingReview(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading reviews...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Reviews
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Review and moderate customer feedback before
          it appears publicly.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* Reviews */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {reviews.length === 0 ? (

          <div className="p-10 text-center">
            <p className="text-sm text-slate-500">
              No reviews have been submitted yet.
            </p>
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full divide-y divide-slate-200">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Reviewer
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Rating
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Review
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">

                {reviews.map((review) => (

                  <tr
                    key={review.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* Reviewer */}
                    <td className="px-6 py-5">

                      <p className="font-medium text-slate-900">
                        {review.reviewer_name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {review.reviewer_email || "No email"}
                      </p>

                    </td>

                    {/* Rating */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-1">

                        <span className="text-sm font-semibold text-slate-800">
                          {review.rating}
                        </span>

                        <span className="text-amber-500">
                          ★
                        </span>

                      </div>

                    </td>

                    {/* Review */}
                    <td className="max-w-md px-6 py-5">

                      <p className="truncate text-sm text-slate-700">
                        {review.comment}
                      </p>

                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">

                      <StatusBadge
                        approved={review.is_approved}
                      />

                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            navigate(
                              `/reviews/${review.id}`
                            )
                          }
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          View
                        </button>

                        {!review.is_approved ? (

                          <button
                            onClick={() =>
                              handleModeration(
                                review.id,
                                true
                              )
                            }
                            disabled={
                              updatingReview ===
                              review.id
                            }
                            className="rounded-lg bg-teal-700 px-3 py-2 text-xs font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {updatingReview === review.id
                              ? "Updating..."
                              : "Approve"}
                          </button>

                        ) : (

                          <button
                            onClick={() =>
                              handleModeration(
                                review.id,
                                false
                              )
                            }
                            disabled={
                              updatingReview ===
                              review.id
                            }
                            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {updatingReview === review.id
                              ? "Updating..."
                              : "Reject"}
                          </button>

                        )}

                      </div>

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

function StatusBadge({ approved }) {
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

export default Reviews;