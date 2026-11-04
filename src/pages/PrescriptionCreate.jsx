
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function PrescriptionCreate() {
  const navigate = useNavigate()

  const [clients, setClients] = useState([])
  const [clientSearch, setClientSearch] = useState("")
  const [selectedClient, setSelectedClient] = useState(null)
  const [loadingClients, setLoadingClients] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

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

  useEffect(() => {
    const searchClients = async () => {
      setLoadingClients(true)

      try {
        const response = await api.get("/clients", {
          params: {
            search: clientSearch,
            page: 1,
            per_page: 20,
          },
        })

        setClients(response.data.clients || [])
      } catch (err) {
        setError("Unable to load clients.")
      } finally {
        setLoadingClients(false)
      }
    }

    const delay = setTimeout(searchClients, 300)

    return () => clearTimeout(delay)
  }, [clientSearch])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!selectedClient) {
      setError("Please select a client.")
      return
    }

    setSaving(true)

    try {
      const payload = {
        client_id: selectedClient.id,
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

      await api.post("/prescriptions", payload)

      navigate("/prescriptions")
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to create prescription."
      )
    } finally {
      setSaving(false)
    }
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
            Record a new client's eye prescription.
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

          {selectedClient ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                background: "#eff6ff",
                borderRadius: "6px",
              }}
            >
              <div>
                <strong>{selectedClient.full_name}</strong>
                <p style={{ margin: "4px 0", fontSize: "13px" }}>
                  {selectedClient.client_number} · {selectedClient.phone}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedClient(null)}
              >
                Change
              </button>
            </div>
          ) : (
            <div style={fieldStyle}>
              <label style={labelStyle}>Search and select client</label>

              <input
                type="text"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Search by name, client number, phone or email..."
                style={inputStyle}
              />

              {loadingClients && (
                <p style={{ fontSize: "13px", color: "#6b7280" }}>
                  Searching clients...
                </p>
              )}

              {clientSearch.trim() !== "" && (
                <div
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    marginTop: "6px",
                    maxHeight: "220px",
                    overflowY: "auto",
                  }}
                >
                  {clients.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => {
                        setSelectedClient(client)
                        setClientSearch("")
                        setClients([])
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "12px",
                        border: "none",
                        borderBottom: "1px solid #e5e7eb",
                        background: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <strong>{client.full_name}</strong>
                      <br />
                      <small>
                        {client.client_number} · {client.phone}
                      </small>
                    </button>
                  ))}

                  {!loadingClients && clients.length === 0 && (
                    <p style={{ padding: "12px", color: "#6b7280" }}>
                      No clients found.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
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
            <label style={labelStyle}>Prescription Date</label>

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
              style={inputStyle}
              placeholder="e.g. Optocare examination room, external optometrist"
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Notes</label>

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
            disabled={saving || !selectedClient}
            style={{
              padding: "12px 22px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: saving || !selectedClient ? "not-allowed" : "pointer",
              opacity: saving || !selectedClient ? 0.6 : 1,
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
