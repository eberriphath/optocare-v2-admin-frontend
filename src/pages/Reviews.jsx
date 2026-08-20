import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Reviews() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading reviews...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Reviews
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage reviews submitted by Optocare users.
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            Unable to load reviews
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
          Reviews
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage reviews submitted by Optocare users.
        </p>
      </div>

      {/* Reviews table */}
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

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">

                {reviews.map((review) => (

                  <tr
                    key={review.id}
                    className="cursor-pointer transition hover:bg-slate-50"
                    onClick={() =>
                      navigate(`/reviews/${review.id}`)
                    }
                  >

                    {/* Reviewer */}
                    <td className="px-6 py-5">

                      <p className="font-medium text-slate-900">
                        {review.reviewer_name || "—"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {review.reviewer_email || "—"}
                      </p>

                    </td>

                    {/* Rating */}
                    <td className="px-6 py-5">

                      <Rating
                        rating={review.rating}
                      />

                    </td>

                    {/* Review */}
                    <td className="px-6 py-5">

                      <p className="max-w-md truncate text-sm text-slate-700">
                        {review.comment || "No comment"}
                      </p>

                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">

                      <ReviewStatus
                        approved={review.is_approved}
                      />

                    </td>

                    {/* Date */}
                    <td className="px-6 py-5">

                      <span className="text-sm text-slate-600">
                        {formatDate(review.created_at)}
                      </span>

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

function Rating({ rating }) {
  return (
    <div className="flex items-center gap-2">

      <span className="font-medium text-slate-800">
        {rating}/5
      </span>

      <span className="text-sm text-amber-500">
        {"★".repeat(Math.max(0, Math.min(5, rating || 0)))}
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
  return new Date(date).toLocaleDateString();
}

export default Reviews;