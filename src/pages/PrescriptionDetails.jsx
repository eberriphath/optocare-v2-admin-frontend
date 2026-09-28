import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function PrescriptionDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        right_sph: "",
        right_cyl: "",
        right_axis: "",
        right_add: "",
        right_pd: "",

        left_sph: "",
        left_cyl: "",
        left_axis: "",
        left_add: "",
        left_pd: "",

        prescription_date: "",
        source: "",
        notes: "",
    });

    const fetchPrescription = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/prescriptions/${id}`
            );

            const data =
                response.data.prescription ||
                response.data;

            setPrescription(data);

            setForm({
                right_sph: data.right_eye?.sph || "",
                right_cyl: data.right_eye?.cyl || "",
                right_axis: data.right_eye?.axis || "",
                right_add: data.right_eye?.add || "",
                right_pd: data.right_eye?.pd || "",

                left_sph: data.left_eye?.sph || "",
                left_cyl: data.left_eye?.cyl || "",
                left_axis: data.left_eye?.axis || "",
                left_add: data.left_eye?.add || "",
                left_pd: data.left_eye?.pd || "",

                prescription_date:
                    data.prescription_date || "",

                source: data.source || "",
                notes: data.notes || "",
            });
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load prescription."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrescription();
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
                `/prescriptions/${id}`,
                {
                    ...form,

                    right_sph: form.right_sph || null,
                    right_cyl: form.right_cyl || null,
                    right_axis: form.right_axis || null,
                    right_add: form.right_add || null,
                    right_pd: form.right_pd || null,

                    left_sph: form.left_sph || null,
                    left_cyl: form.left_cyl || null,
                    left_axis: form.left_axis || null,
                    left_add: form.left_add || null,
                    left_pd: form.left_pd || null,

                    prescription_date:
                        form.prescription_date || null,

                    source: form.source || null,
                    notes: form.notes || null,
                }
            );

            const updated =
                response.data.prescription ||
                response.data;

            setPrescription(updated);

            setForm({
                right_sph: updated.right_eye?.sph || "",
                right_cyl: updated.right_eye?.cyl || "",
                right_axis: updated.right_eye?.axis || "",
                right_add: updated.right_eye?.add || "",
                right_pd: updated.right_eye?.pd || "",

                left_sph: updated.left_eye?.sph || "",
                left_cyl: updated.left_eye?.cyl || "",
                left_axis: updated.left_eye?.axis || "",
                left_add: updated.left_eye?.add || "",
                left_pd: updated.left_eye?.pd || "",

                prescription_date:
                    updated.prescription_date || "",

                source: updated.source || "",
                notes: updated.notes || "",
            });
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to update prescription."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-sm text-gray-500">
                Loading prescription...
            </div>
        );
    }

    if (!prescription) {
        return (
            <div className="space-y-4">

                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error || "Prescription not found."}
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/prescriptions")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    ← Back to prescriptions
                </button>

            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>

                <button
                    type="button"
                    onClick={() => navigate("/prescriptions")}
                    className="mb-2 text-sm text-gray-500 hover:text-gray-700"
                >
                    ← Back to prescriptions
                </button>

                <h1 className="text-2xl font-semibold text-gray-900">
                    Prescription
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    {prescription.client?.client_number} —{" "}
                    {prescription.client?.full_name}
                </p>

            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Prescription Form */}
            <form
                onSubmit={handleSave}
                className="space-y-6"
            >

                {/* Right Eye */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Right Eye (OD)
                    </h2>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

                        {[
                            ["right_sph", "SPH"],
                            ["right_cyl", "CYL"],
                            ["right_axis", "AXIS"],
                            ["right_add", "ADD"],
                            ["right_pd", "PD"],
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

                {/* Left Eye */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Left Eye (OS)
                    </h2>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

                        {[
                            ["left_sph", "SPH"],
                            ["left_cyl", "CYL"],
                            ["left_axis", "AXIS"],
                            ["left_add", "ADD"],
                            ["left_pd", "PD"],
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

                {/* Metadata */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Prescription Details
                    </h2>

                    <div className="grid gap-5 md:grid-cols-2">

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Prescription Date
                            </label>

                            <input
                                type="date"
                                name="prescription_date"
                                value={form.prescription_date}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Source
                            </label>

                            <input
                                type="text"
                                name="source"
                                value={form.source}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                    </div>

                    <div className="mt-5">

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

                </div>

                {/* Actions */}
                <div className="flex justify-end">

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : "Save Prescription"}
                    </button>

                </div>

            </form>

            {/* Client Link */}
            {prescription.client?.id && (
                <div className="text-sm">
                    <Link
                        to={`/clients/${prescription.client.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                    >
                        View Client →
                    </Link>
                </div>
            )}

        </div>
    );
}

export default PrescriptionDetails;