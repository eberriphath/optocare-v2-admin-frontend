import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

function Prescriptions() {
    const [searchParams] = useSearchParams();

    const clientId = searchParams.get("client_id");

    const [prescriptions, setPrescriptions] = useState([]);
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

    const fetchPrescriptions = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {
                page,
                per_page: 10,
                search: search.trim(),
            };

            if (clientId) {
                params.client_id = clientId;
            }

            const response = await api.get(
                "/prescriptions",
                { params }
            );

            setPrescriptions(
                response.data.prescriptions || []
            );

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
                "Failed to load prescriptions."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrescriptions();
    }, [page, clientId]);

    const handleSearch = (event) => {
        event.preventDefault();

        setPage(1);
        fetchPrescriptions();
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Prescriptions
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Manage client optical prescriptions.
                </p>
            </div>

            {/* Search */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">

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
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

                {loading ? (
                    <div className="p-8 text-center text-sm text-gray-500">
                        Loading prescriptions...
                    </div>
                ) : prescriptions.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500">
                        No prescriptions found.
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
                                        Right Eye
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Left Eye
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Date
                                    </th>

                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">

                                {prescriptions.map((prescription) => (

                                    <tr
                                        key={prescription.id}
                                        className="hover:bg-gray-50"
                                    >

                                        <td className="px-6 py-4">

                                            <div className="font-medium text-gray-900">
                                                {prescription.client?.full_name}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                {prescription.client?.client_number}
                                            </div>

                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {prescription.right_eye?.sph || "—"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {prescription.left_eye?.sph || "—"}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {prescription.prescription_date || "—"}
                                        </td>

                                        <td className="px-6 py-4 text-right">

                                            <Link
                                                to={`/prescriptions/${prescription.id}`}
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
            {!loading && prescriptions.length > 0 && (
                <div className="flex items-center justify-between">

                    <p className="text-sm text-gray-500">
                        Page {pagination.page} of{" "}
                        {pagination.pages} ({pagination.total} prescriptions)
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

export default Prescriptions;