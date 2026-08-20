import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/admin/products/${id}`);

        setProduct(response.data.product);
      } catch (error) {
        console.error("Failed to load product:", error);

        setError(
          error.response?.data?.error ||
          "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAvailabilityChange = async () => {
    if (!product) {
      return;
    }

    const currentlyAvailable = product.is_available;

    const confirmed = window.confirm(
      currentlyAvailable
        ? "Are you sure you want to mark this product as unavailable?"
        : "Are you sure you want to make this product available?"
    );

    if (!confirmed) {
      return;
    }

    setUpdatingAvailability(true);
    setError("");

    try {
      const response = await api.patch(
        `/admin/products/${id}/availability`,
        {
          is_available: !currentlyAvailable,
        }
      );

      setProduct((current) => ({
        ...current,
        is_available: response.data.product.is_available,
      }));
    } catch (error) {
      console.error(
        "Failed to update product availability:",
        error
      );

      setError(
        error.response?.data?.error ||
        "Unable to update product availability."
      );
    } finally {
      setUpdatingAvailability(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading product...
        </p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="space-y-6">

        <button
          onClick={() => navigate("/products")}
          className="text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          ← Back to products
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            Unable to load product
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        </div>

      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div>

          <button
            onClick={() => navigate("/products")}
            className="mb-4 text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            ← Back to products
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            Product Details
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View information about this product.
          </p>

        </div>

        <AvailabilityBadge
          available={product.is_available}
        />

      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* Product image and information */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Product Information
          </h2>
        </div>

        <div className="grid gap-8 p-6 lg:grid-cols-[240px_1fr]">

          {/* Image */}
          <div>

            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="aspect-square w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-400">
                No image available
              </div>
            )}

          </div>

          {/* Details */}
          <div className="grid gap-6 sm:grid-cols-2">

            <InfoItem
              label="Product Name"
              value={product.name}
            />

            <InfoItem
              label="Brand"
              value={product.brand}
            />

            <InfoItem
              label="Category"
              value={product.category}
            />

            <InfoItem
              label="Price"
              value={
                product.price !== null
                  ? `KES ${Number(product.price).toLocaleString()}`
                  : "Not specified"
              }
            />

            <InfoItem
              label="Stock Quantity"
              value={product.stock_quantity}
            />

            <InfoItem
              label="Availability"
              value={
                product.is_available
                  ? "Available"
                  : "Unavailable"
              }
            />

          </div>

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
            {product.description || "No description provided."}
          </p>

        </div>

      </section>

      {/* Partner */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Product Provider
          </h2>

        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">

          <InfoItem
            label="Name"
            value={product.partner?.user?.name}
          />

          <InfoItem
            label="Email"
            value={product.partner?.user?.email}
          />

          <InfoItem
            label="Company"
            value={product.partner?.company_name}
          />

          <InfoItem
            label="Partner Type"
            value={product.partner?.partner_type}
          />

        </div>

      </section>

      {/* History */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Product History
          </h2>

        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">

          <InfoItem
            label="Created"
            value={formatDate(product.created_at)}
          />

          <InfoItem
            label="Last Updated"
            value={formatDate(product.updated_at)}
          />

        </div>

      </section>

      {/* Availability controls */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-semibold text-slate-900">
            Product Availability
          </h2>

        </div>

        <div className="p-6">

          <button
            onClick={handleAvailabilityChange}
            disabled={updatingAvailability}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              product.is_available
                ? "bg-red-600 hover:bg-red-700"
                : "bg-teal-700 hover:bg-teal-800"
            }`}
          >
            {updatingAvailability
              ? "Updating..."
              : product.is_available
                ? "Mark Unavailable"
                : "Make Available"}
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
        {value ?? "—"}
      </p>
    </div>
  );
}

function AvailabilityBadge({ available }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        available
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
          : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
      }`}
    >
      {available ? "Available" : "Unavailable"}
    </span>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleString();
}

export default ProductDetails;