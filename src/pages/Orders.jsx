import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const ORDER_STATUSES = [
    "submitted",
    "under_review",
    "confirmed",
    "processing",
    "ready",
    "completed",
];

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1,
        total: 0,
        per_page: 10,
    });

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {
                page,
                per_page: 10,
                search: search.trim(),
            };

            if (status) {
                params.status = status;
            }

            const response = await api.get(
                "/orders",
                { params }
            );

            setOrders(response.data.orders || []);

            setPagination(
                response.data.pagination || {
                    page: 1,
                    pages: 1,
                    total: 0,
                    per_page: 10,
                }
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load orders."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, status]);

    const handleSearch = (event) => {
        event.preventDefault();

        setPage(1);
        fetchOrders();
    };

    const formatStatus = (value) => {
        if (!value) {
            return "—";
        }

        return value
            .replaceAll("_", " ")
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    const statusClass = (value) => {
        switch (value) {
            case "submitted":
                return "bg-blue-50 text-blue-700";

            case "under_review":
                return "bg-yellow-50 text-yellow-700";

            case "confirmed":
                return "bg-indigo-50 text-indigo-700";

            case "processing":
                return "bg-purple-50 text-purple-700";

            case "ready":
                return "bg-green-50 text-green-700";

            case "completed":
                return "bg-gray-100 text-gray-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Orders
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Manage glasses and optical orders submitted to Optocare.
                </p>
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">

                <form
                    onSubmit={handleSearch}
                    className="grid gap-3 md:grid-cols-[1fr_auto_auto]"
                >

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search order number, client number, name or phone..."
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />

                    <select
                        value={status}
                        onChange={(event) => {
                            setStatus(event.target.value);
                            setPage(1);
                        }}
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">
                            All statuses
                        </option>

                        {ORDER_STATUSES.map((item) => (
                            <option
                                key={item}
                                value={item}
                            >
                                {formatStatus(item)}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Search
                    </button>

                </form>

            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

                {loading ? (
                    <div className="p-8 text-center text-sm text-gray-500">
                        Loading orders...
                    </div>
                ) : orders.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500">
                        No orders found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="min-w-full divide-y divide-gray-200">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Order
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Client
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Partner
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Created
                                    </th>

                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">

                                {orders.map((order) => (

                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50"
                                    >

                                        <td className="px-6 py-4">

                                            <div className="font-medium text-gray-900">
                                                {order.order_number}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                #{order.id}
                                            </div>

                                        </td>

                                        <td className="px-6 py-4">

                                            <div className="font-medium text-gray-900">
                                                {order.client?.full_name || "—"}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                {order.client?.client_number || "—"}
                                            </div>

                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {order.partner_id
                                                ? `Partner #${order.partner_id}`
                                                : "Unassigned"}
                                        </td>

                                        <td className="px-6 py-4">

                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass(order.status)}`}
                                            >
                                                {formatStatus(order.status)}
                                            </span>

                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {order.created_at
                                                ? new Date(
                                                    order.created_at
                                                ).toLocaleDateString()
                                                : "—"}
                                        </td>

                                        <td className="px-6 py-4 text-right">

                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                View
                                            </Link>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* Pagination */}
            {!loading && orders.length > 0 && (
                <div className="flex items-center justify-between">

                    <p className="text-sm text-gray-500">
                        Page {pagination.page} of{" "}
                        {pagination.pages} ({pagination.total} orders)
                    </p>

                    <div className="flex gap-2">

                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() =>
                                setPage((current) => current - 1)
                            }
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            disabled={page >= pagination.pages}
                            onClick={() =>
                                setPage((current) => current + 1)
                            }
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Orders;