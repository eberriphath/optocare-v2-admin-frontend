import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1,
        total: 0,
        per_page: 10,
    });

    const fetchClients = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/clients", {
                params: {
                    page,
                    per_page: 10,
                    search: search.trim(),
                },
            });

            setClients(response.data.clients || []);

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
                "Failed to load clients."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, [page]);

    const handleSearch = (event) => {
        event.preventDefault();

        setPage(1);
        fetchClients();
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Clients
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Manage Optocare clients and view their optical history.
                </p>
            </div>

            {/* Search */}
            <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">

                <form
                    onSubmit={handleSearch}
                    className="flex flex-col gap-3 sm:flex-row"
                >
                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search by client number, name, phone or email..."
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />

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
            <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">

                {loading ? (
                    <div className="p-8 text-center text-sm text-gray-500">
                        Loading clients...
                    </div>
                ) : clients.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500">
                        No clients found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="min-w-full divide-y divide-gray-200">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Client
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Phone
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Email
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Date of Birth
                                    </th>

                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">

                                {clients.map((client) => (

                                    <tr
                                        key={client.id}
                                        className="hover:bg-gray-50"
                                    >

                                        <td className="px-6 py-4">

                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {client.full_name}
                                                </div>

                                                <div className="text-xs text-gray-500">
                                                    {client.client_number}
                                                </div>
                                            </div>

                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {client.phone}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {client.email || "—"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {client.date_of_birth || "—"}
                                        </td>

                                        <td className="px-6 py-4 text-right">

                                            <Link
                                                to={`/clients/${client.id}`}
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
            {!loading && clients.length > 0 && (
                <div className="flex items-center justify-between">

                    <p className="text-sm text-gray-500">
                        Showing page {pagination.page} of{" "}
                        {pagination.pages} ({pagination.total} clients)
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

export default Clients;