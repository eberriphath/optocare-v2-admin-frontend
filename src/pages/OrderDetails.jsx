import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const ORDER_STATUSES = [
    "submitted",
    "under_review",
    "confirmed",
    "processing",
    "ready",
    "completed",
];

function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [statusSaving, setStatusSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState("");
    const [assigningPartner, setAssigningPartner] = useState(false);

    const [form, setForm] = useState({
        client_id: "",
        prescription_id: "",
        frame_make: "",
        frame_model: "",
        frame_size: "",
        tint_color: "",
        lens_type: "",
        coating: "",
        base_curve: "",
        remarks: "",
    });

    const [status, setStatus] = useState("");

    const fetchOrder = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/orders/${id}`
            );

            const data =
                response.data.order ||
                response.data;

            setOrder(data);

            setStatus(data.status || "");

            setSelectedPartner(
                data.partner_id
                    ? String(data.partner_id)
                    : ""
            );

            setForm({
                client_id: data.client?.id || "",
                prescription_id:
                    data.prescription_id || "",
                frame_make: data.frame_make || "",
                frame_model: data.frame_model || "",
                frame_size: data.frame_size || "",
                tint_color: data.tint_color || "",
                lens_type: data.lens_type || "",
                coating: data.coating || "",
                base_curve: data.base_curve || "",
                remarks: data.remarks || "",
            });
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load order."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchPartners = async () => {
        try {
            const response = await api.get("/partners");

            setPartners(
                response.data.partners ||
                response.data ||
                []
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load partners."
            );
        }
    };

    useEffect(() => {
        fetchOrder();
        fetchPartners();
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
            setSuccess("");

            const payload = {
                client_id: Number(form.client_id),

                prescription_id:
                    form.prescription_id
                        ? Number(form.prescription_id)
                        : null,

                frame_make:
                    form.frame_make || null,

                frame_model:
                    form.frame_model || null,

                frame_size:
                    form.frame_size || null,

                tint_color:
                    form.tint_color || null,

                lens_type:
                    form.lens_type || null,

                coating:
                    form.coating || null,

                base_curve:
                    form.base_curve || null,

                remarks:
                    form.remarks || null,
            };

            const response = await api.put(
                `/orders/${id}`,
                payload
            );

            const updated =
                response.data.order ||
                response.data;

            setOrder(updated);

            setSuccess(
                "Order details updated successfully."
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to update order."
            );
        } finally {
            setSaving(false);
        }
    };

    const handlePartnerAssignment = async () => {
        try {
            setAssigningPartner(true);
            setError("");
            setSuccess("");

            const response = await api.put(
                `/orders/${id}/partner`,
                {
                    partner_id: selectedPartner
                        ? Number(selectedPartner)
                        : null,
                }
            );

            const updatedOrder =
                response.data.order ||
                response.data;

            setOrder(updatedOrder);

            setSelectedPartner(
                updatedOrder.partner_id
                    ? String(updatedOrder.partner_id)
                    : ""
            );

            setSuccess(
                selectedPartner
                    ? "Order assigned to partner successfully."
                    : "Partner assignment removed successfully."
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to update partner assignment."
            );
        } finally {
            setAssigningPartner(false);
        }
    };

const handleStatusUpdate = async () => {
    try {
        setStatusSaving(true);
        setError("");
        setSuccess("");

        const response = await api.put(
            `/orders/${id}/status`,
            {
                status,
            }
        );

        const updatedOrder =
            response.data.order ||
            response.data;

        setOrder(updatedOrder);

        setStatus(updatedOrder.status || "");

        setSuccess(
            "Order status updated successfully."
        );
    } catch (err) {
        console.error(err);

        setError(
            err.response?.data?.message ||
            "Failed to update order status."
        );
    } finally {
        setStatusSaving(false);
    }
};

    const formatStatus = (value) => {
        return value
            ? value
                .replaceAll("_", " ")
                .replace(/\b\w/g, (letter) =>
                    letter.toUpperCase()
                )
            : "—";
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-sm text-gray-500">
                Loading order...
            </div>
        );
    }

    if (!order) {
        return (
            <div className="space-y-4">

                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error || "Order not found."}
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/orders")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    ← Back to orders
                </button>

            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>

                    <button
                        type="button"
                        onClick={() => navigate("/orders")}
                        className="mb-2 text-sm text-gray-500 hover:text-gray-700"
                    >
                        ← Back to orders
                    </button>

                    <h1 className="text-2xl font-semibold text-gray-900">
                        {order.order_number}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Order #{order.id}
                    </p>

                </div>

                <span className="inline-flex w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                    {formatStatus(order.status)}
                </span>

            </div>

            {/* Messages */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                </div>
            )}

            {/* Client */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

                <div className="flex items-start justify-between gap-4">

                    <div>

                        <h2 className="text-lg font-semibold text-gray-900">
                            Client
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Customer attached to this order.
                        </p>

                    </div>

                    {order.client?.id && (
                        <Link
                            to={`/clients/${order.client.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            View Client →
                        </Link>
                    )}

                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-3">

                    <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Client Number
                        </p>

                        <p className="mt-1 text-sm text-gray-900">
                            {order.client?.client_number || "—"}
                        </p>

                    </div>

                    <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Name
                        </p>

                        <p className="mt-1 text-sm text-gray-900">
                            {order.client?.full_name || "—"}
                        </p>

                    </div>

                    <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Phone
                        </p>

                        <p className="mt-1 text-sm text-gray-900">
                            {order.client?.phone || "—"}
                        </p>

                    </div>

                </div>

            </div>

            {/* Order Details */}
            <form
                onSubmit={handleSave}
                className="space-y-6"
            >

                {/* Frame */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Frame
                    </h2>

                    <div className="grid gap-5 md:grid-cols-2">

                        {[
                            ["frame_make", "Frame Make"],
                            ["frame_model", "Frame Model"],
                            ["frame_size", "Frame Size"],
                            ["tint_color", "Tint / Color"],
                        ].map(([name, label]) => (

                            <div key={name}>

                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    {label}
                                </label>

                                <input
                                    type="text"
                                    name={name}
                                    value={form[name]}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />

                            </div>

                        ))}

                    </div>

                </div>

                {/* Lenses */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Lenses
                    </h2>

                    <div className="grid gap-5 md:grid-cols-3">

                        {[
                            ["lens_type", "Lens Type"],
                            ["coating", "Coating"],
                            ["base_curve", "Base Curve"],
                        ].map(([name, label]) => (

                            <div key={name}>

                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    {label}
                                </label>

                                <input
                                    type="text"
                                    name={name}
                                    value={form[name]}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />

                            </div>

                        ))}

                    </div>

                </div>

                {/* Prescription */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Prescription
                    </h2>

                    <div className="grid gap-5 md:grid-cols-2">

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Prescription ID
                            </p>

                            <p className="mt-1 text-sm text-gray-900">
                                {order.prescription_id ||
                                    "No prescription attached"}
                            </p>

                        </div>

                        {order.prescription_id && (
                            <div className="md:text-right">

                                <Link
                                    to={`/prescriptions/${order.prescription_id}`}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                    View Prescription →
                                </Link>

                            </div>
                        )}

                    </div>

                </div>

                {/* Remarks */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Remarks
                    </h2>

                    <textarea
                        name="remarks"
                        value={form.remarks}
                        onChange={handleChange}
                        rows={5}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />

                </div>

                {/* Save */}
                <div className="flex justify-end">

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : "Save Order Details"}
                    </button>

                </div>

            </form>

            {/* Status */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

                <h2 className="text-lg font-semibold text-gray-900">
                    Order Status
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Status transitions will be enforced by the backend order workflow.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(event.target.value)
                        }
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >

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
                        type="button"
                        onClick={handleStatusUpdate}
                        disabled={statusSaving}
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        {statusSaving
                            ? "Updating..."
                            : "Update Status"}
                    </button>

                </div>

            </div>

            {/* Partner Assignment */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

                <div className="mb-5">

                    <h2 className="text-lg font-semibold text-gray-900">
                        Partner Assignment
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Assign this order to an Optocare partner.
                    </p>

                </div>

                <div className="space-y-5">

                    <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Partner
                        </label>

                        <select
                            value={selectedPartner}
                            onChange={(event) =>
                                setSelectedPartner(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >

                            <option value="">
                                Unassigned
                            </option>

                            {partners.map((partner) => (

                                <option
                                    key={partner.id}
                                    value={partner.id}
                                >
                                    {partner.business_name ||
                                        partner.company_name ||
                                        partner.full_name ||
                                        `Partner #${partner.id}`}
                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-sm text-gray-500">
                            {selectedPartner
                                ? "A partner is selected for this order."
                                : "This order is currently unassigned."}
                        </p>

                        <button
                            type="button"
                            onClick={handlePartnerAssignment}
                            disabled={assigningPartner}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {assigningPartner
                                ? "Saving..."
                                : "Save Assignment"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default OrderDetails;

