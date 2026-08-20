import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/admin/products");

        setProducts(response.data.products);
      } catch (error) {
        console.error("Failed to load products:", error);

        setError(
          error.response?.data?.error ||
          "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading products...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Products
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage products offered by Optocare partners.
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            Unable to load products
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
          Products
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage products offered by Optocare partners.
        </p>
      </div>

      {/* Products */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {products.length === 0 ? (

          <div className="p-10 text-center">
            <p className="text-sm text-slate-500">
              No products have been added yet.
            </p>
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full divide-y divide-slate-200">

              <thead className="bg-slate-50">
                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Partner
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Availability
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">

                {products.map((product) => (

                  <tr
                    key={product.id}
                    className="cursor-pointer transition hover:bg-slate-50"
                    onClick={() =>
                      navigate(`/products/${product.id}`)
                    }
                  >

                    {/* Product */}
                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                            No image
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-slate-900">
                            {product.name}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {product.brand || "No brand"}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* Partner */}
                    <td className="px-6 py-5">

                      <p className="font-medium text-slate-900">
                        {product.partner?.user?.name || "—"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {product.partner?.user?.email || "—"}
                      </p>

                    </td>

                    {/* Category */}
                    <td className="px-6 py-5">

                      <span className="text-sm text-slate-700">
                        {product.category || "—"}
                      </span>

                    </td>

                    {/* Price */}
                    <td className="px-6 py-5">

                      <span className="text-sm font-medium text-slate-800">
                        {product.price !== null &&
                        product.price !== undefined
                          ? `KES ${Number(product.price).toLocaleString()}`
                          : "Not specified"}
                      </span>

                    </td>

                    {/* Stock */}
                    <td className="px-6 py-5">

                      <span className="text-sm text-slate-700">
                        {product.stock_quantity}
                      </span>

                    </td>

                    {/* Availability */}
                    <td className="px-6 py-5">

                      <AvailabilityBadge
                        available={product.is_available}
                      />

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

export default Products;