
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function PrescriptionCreate() {
  const navigate = useNavigate()

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [conflict, setConflict] = useState(null)
  const [pendingPayload, setPendingPayload] = useState(null)

  const [clientData, setClientData] = useState({
    full_name: "",
    phone: "",
    email: "",
    date_of_birth: "",
    notes: "",
  })

  const [formData, setFormData] = useState({
    prescription_date: new Date().toISOString().split("T")[0],

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

    source: "",
    notes: "",
  })

  const handleClientChange = (e) => {
    const { name, value } = e.target

    setClientData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const submitPrescription = async (payload) => {
    setSaving(true)
    setError("")
    setConflict(null)

    try {
      await api.post("/prescriptions", payload)

      navigate("/prescriptions")
    } catch (err) {
      const responseData = err.response?.data

      if (
        err.response?.status === 409 &&
        responseData?.requires_confirmation
      ) {
        const matches = responseData.matches || []

        const normalizeName = (name) =>
          name.trim().toLowerCase().replace(/\s+/g, " ")

        const hasSameName = matches.some(
          (client) =>
            normalizeName(client.full_name) ===
            normalizeName(clientData.full_name)
        )

        setPendingPayload(payload)

        setConflict({
          message: responseData.message,
          matches,
          allowSeparateClient: !hasSameName,
        })
      } else {
        setError(
          responseData?.message ||
          responseData?.error ||
          "Failed to create prescription."
        )
      }
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setConflict(null)

    if (!clientData.full_name.trim()) {
      setError("Client name is required.")
      return
    }

    if (!clientData.phone.trim()) {
      setError("Client phone number is required.")
      return
    }

    const payload = {
      client: {
        full_name: clientData.full_name.trim(),
        phone: clientData.phone.trim(),
        email: clientData.email.trim(),
        date_of_birth: clientData.date_of_birth || null,
        notes: clientData.notes.trim(),
      },

      prescription_date: formData.prescription_date,

      right_sph: formData.right_sph,
      right_cyl: formData.right_cyl,
      right_axis: formData.right_axis,
      right_add: formData.right_add,
      right_pd: formData.right_pd,

      left_sph: formData.left_sph,
      left_cyl: formData.left_cyl,
      left_axis: formData.left_axis,
      left_add: formData.left_add,
      left_pd: formData.left_pd,

      source: formData.source,
      notes: formData.notes,
    }

    await submitPrescription(payload)
  }

  const useExistingClient = async (client) => {
    if (!pendingPayload) return

    const payload = {
      ...pendingPayload,
      client_id: client.id,
    }

    delete payload.client
    delete payload.allow_duplicate_phone

    await submitPrescription(payload)
  }

  const createSeparateClient = async () => {
    if (!pendingPayload) return

    await submitPrescription({
      ...pendingPayload,
      allow_duplicate_phone: true,
    })
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    boxSizing: "border-box",
  }

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  }

  const fieldStyle = {
    marginBottom: "16px",
  }

  const renderEyeFields = (title, prefix) => (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "18px" }}>
        {title}
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "14px",
        }}
      >
        {[
          ["SPH", "sph"],
          ["CYL", "cyl"],
          ["AXIS", "axis"],
          ["ADD", "add"],
          ["PD", "pd"],
        ].map(([label, field]) => (
          <div key={field}>
            <label style={labelStyle}>{label}</label>

            <input
              type="number"
              step="any"
              name={`${prefix}_${field}`}
              value={formData[`${prefix}_${field}`]}
              onChange={handleChange}
              style={inputStyle}
              placeholder={label}
            />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ padding: "24px", maxWidth: "1000px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Add Prescription</h1>

          <p style={{ color: "#6b7280", marginBottom: 0 }}>
            Enter client details and record their eye prescription.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/prescriptions")}
          style={{
            padding: "10px 16px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {conflict && (
        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#9a3412" }}>
            Client verification required
          </h3>

          <p style={{ color: "#7c2d12" }}>
            {conflict.message}
          </p>

          <p style={{ fontWeight: "600" }}>
            Existing client records:
          </p>

          {conflict.matches.map((client) => (
            <div
              key={client.id}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                padding: "12px",
                marginBottom: "10px",
              }}
            >
              <strong>{client.full_name}</strong>

              <p style={{ margin: "4px 0", fontSize: "13px" }}>
                {client.client_number} · {client.phone}
              </p>

              <button
                type="button"
                disabled={saving}
                onClick={() => useExistingClient(client)}
                style={{
                  padding: "8px 12px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                Use this existing client
              </button>
            </div>
          ))}

          {conflict.allowSeparateClient && (
            <div style={{ marginTop: "16px" }}>
              <p style={{ fontSize: "13px", color: "#7c2d12" }}>
                If this is a different person who shares the same
                phone number, you can create a separate client record.
              </p>

              <button
                type="button"
                disabled={saving}
                onClick={createSeparateClient}
                style={{
                  padding: "10px 14px",
                  background: "#15803d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                Confirm and create separate client
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setConflict(null)
              setPendingPayload(null)
            }}
            style={{
              marginTop: "14px",
              padding: "9px 14px",
              background: "#f3f4f6",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Cancel verification
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Client Information</h3>

          <div style={fieldStyle}>
            <label style={labelStyle}>Full Name *</label>

            <input
              type="text"
              name="full_name"
              value={clientData.full_name}
              onChange={handleClientChange}
              required
              maxLength={150}
              style={inputStyle}
              placeholder="Enter client's full name"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            <div style={fieldStyle}>
              <label style={labelStyle}>Phone Number *</label>

              <input
                type="tel"
                name="phone"
                value={clientData.phone}
                onChange={handleClientChange}
                required
                maxLength={30}
                style={inputStyle}
                placeholder="e.g. 0712345678"
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Email Address</label>

              <input
                type="email"
                name="email"
                value={clientData.email}
                onChange={handleClientChange}
                maxLength={150}
                style={inputStyle}
                placeholder="client@example.com"
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Date of Birth</label>

              <input
                type="date"
                name="date_of_birth"
                value={clientData.date_of_birth}
                onChange={handleClientChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Client Notes</label>

            <textarea
              name="notes"
              value={clientData.notes}
              onChange={handleClientChange}
              rows="3"
              style={inputStyle}
              placeholder="Additional client information..."
            />
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Prescription Information</h3>

          <div style={{ ...fieldStyle, maxWidth: "250px" }}>
            <label style={labelStyle}>Prescription Date *</label>

            <input
              type="date"
              name="prescription_date"
              value={formData.prescription_date}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
        </div>

        <h2>Eye Measurements</h2>

        {renderEyeFields("Right Eye (OD)", "right")}
        {renderEyeFields("Left Eye (OS)", "left")}

        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Additional Information</h3>

          <div style={fieldStyle}>
            <label style={labelStyle}>Source</label>

            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              maxLength={150}
              style={inputStyle}
              placeholder="e.g. Optocare examination room, external optometrist"
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Prescription Notes</label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              style={inputStyle}
              placeholder="Additional prescription notes..."
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "12px 22px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Saving..." : "Save Prescription"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/prescriptions")}
            style={{
              padding: "12px 22px",
              background: "#f3f4f6",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default PrescriptionCreate
