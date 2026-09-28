import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function ClientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [history, setHistory] = useState({
        prescriptions: [],
        orders: [],
    });

    const [form, setForm] = useState({
        full_name: "",
        phone: "",
        email: "",
        date_of_birth: "",
        notes: "",
    });

    const fetchClient = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/clients/${id}`);

            const data = response.data.client || response.data;

            setClient(data);

            setForm({
                full_name: data.full_name || "",
                phone: data.phone || "",
                email: data.email || "",
                date_of_birth: data.date_of_birth || "",
                notes: data.notes || "",
            });
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load client."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await api.get(
                `/clients/${id}/history`
            );

            setHistory({
                prescriptions:
                    response.data.prescriptions || [],

                orders:
                    response.data.orders || [],
            });
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load client history."
            );
        }
    };

    useEffect(() => {
        fetchClient();
        fetchHistory();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSave = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            const response = await api.put(
                `/clients/${id}`,
                {
                    full_name: form.full_name,
                    phone: form.phone,
                    email: form.email || null,
                    date_of_birth: form.date_of_birth || null,
                    notes: form.notes || null,
                }
            );

            const updatedClient =
                response.data.client || response.data;

            setClient(updatedClient);

            setForm({
                full_name: updatedClient.full_name || "",
                phone: updatedClient.phone || "",
                email: updatedClient.email || "",
                date_of_birth: updatedClient.date_of_birth || "",
                notes: updatedClient.notes || "",
            });

            setEditing(false);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to update client."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-sm text-gray-500">
                Loading client...
            </div>
        );
    }

    if (!client) {
        return (
            <div className="space-y-4">

                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error || "Client not found."}
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/clients")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    ← Back to clients
                </button>

            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <button
                        type="button"
                        onClick={() => navigate("/clients")}
                        className="mb-2 text-sm text-gray-500 hover:text-gray-700"
                    >
                        ← Back to clients
                    </button>

                    <h1 className="text-2xl font-semibold text-gray-900">
                        {client.full_name}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        {client.client_number}
                    </p>

                </div>

                {!editing && (
                    <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Edit Client
                    </button>
                )}

            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Client Information */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

                <div className="mb-5">

                    <h2 className="text-lg font-semibold text-gray-900">
                        Client Information
                    </h2>

                </div>

                {editing ? (

                    <form
                        onSubmit={handleSave}
                        className="space-y-5"
                    >

                        <div className="grid gap-5 md:grid-cols-2">

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="full_name"
                                    value={form.full_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />

                            </div>

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />

                            </div>

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />

                            </div>

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Date of Birth
                                </label>

                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={form.date_of_birth}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />

                            </div>

                        </div>

                        <div>

                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Notes
                            </label>

                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                rows={4}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />

                        </div>

                        <div className="flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() => setEditing(false)}
                                disabled={saving}
                                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </form>

                ) : (

                    <div className="grid gap-6 md:grid-cols-2">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Client Number
                            </p>

                            <p className="mt-1 text-sm text-gray-900">
                                {client.client_number}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Full Name
                            </p>

                            <p className="mt-1 text-sm text-gray-900">
                                {client.full_name}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Phone
                            </p>

                            <p className="mt-1 text-sm text-gray-900">
                                {client.phone}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Email
                            </p>

                            <p className="mt-1 text-sm text-gray-900">
                                {client.email || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Date of Birth
                            </p>

                            <p className="mt-1 text-sm text-gray-900">
                                {client.date_of_birth || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Created
                            </p>

                            <p className="mt-1 text-sm text-gray-900">
                                {client.created_at
                                    ? new Date(
                                        client.created_at
                                    ).toLocaleString()
                                    : "—"}
                            </p>
                        </div>

                        <div className="md:col-span-2">

                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Notes
                            </p>

                            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
                                {client.notes || "No notes."}
                            </p>

                        </div>

                    </div>

                )}

            </div>

            {/* Prescription History */}
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">

                <div className="border-b border-gray-100 px-6 py-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <h2 className="text-lg font-semibold text-gray-900">
                                Prescription History
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Prescriptions associated with this client.
                            </p>

                        </div>

                        <Link
                            to={`/prescriptions?client_id=${id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            View All
                        </Link>

                    </div>

                </div>

                {history.prescriptions.length === 0 ? (

                    <div className="p-6 text-sm text-gray-500">
                        No prescriptions recorded.
                    </div>

                ) : (

                    <div className="divide-y divide-gray-100">

                        {history.prescriptions.map((prescription) => (

                            <div
                                key={prescription.id}
                                className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                            >

                                <div>

                                    <p className="font-medium text-gray-900">
                                        Prescription #{prescription.id}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {prescription.prescription_date ||
                                            "Date not recorded"}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Source:{" "}
                                        {prescription.source ||
                                            "Not specified"}
                                    </p>

                                </div>

                                <Link
                                    to={`/prescriptions/${prescription.id}`}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                    View →
                                </Link>

                            </div>

                        ))}

                    </div>

                )}

            </div>

            {/* Order History */}
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">

                <div className="border-b border-gray-100 px-6 py-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <h2 className="text-lg font-semibold text-gray-900">
                                Order History
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Glasses and optical orders associated with this client.
                            </p>

                        </div>

                        <Link
                            to="/orders"
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            View All
                        </Link>

                    </div>

                </div>

                {history.orders.length === 0 ? (

                    <div className="p-6 text-sm text-gray-500">
                        No orders recorded.
                    </div>

                ) : (

                    <div className="divide-y divide-gray-100">

                        {history.orders.map((order) => (

                            <div
                                key={order.id}
                                className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                            >

                                <div>

                                    <p className="font-medium text-gray-900">
                                        {order.order_number}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {order.created_at
                                            ? new Date(
                                                order.created_at
                                            ).toLocaleDateString()
                                            : "Date not recorded"}
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-2">

                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                            {order.status
                                                ? order.status
                                                    .replaceAll("_", " ")
                                                    .replace(
                                                        /\b\w/g,
                                                        (letter) =>
                                                            letter.toUpperCase()
                                                    )
                                                : "Unknown"}
                                        </span>

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                            {order.partner_id
                                                ? `Partner #${order.partner_id}`
                                                : "Unassigned"}
                                        </span>

                                    </div>

                                </div>

                                <Link
                                    to={`/orders/${order.id}`}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                    View →
                                </Link>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default ClientDetails;