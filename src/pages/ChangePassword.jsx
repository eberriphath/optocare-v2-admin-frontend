import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (form.new_password.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (form.new_password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/change-password",
        form
      );

      setMessage(
        response.data.message ||
        "Password changed successfully."
      );

      setForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error(
        "Failed to change password:",
        error
      );

      setError(
        error.response?.data?.error ||
        "Unable to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">

      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          ← Back to dashboard
        </button>

        <h1 className="text-2xl font-bold text-slate-900">
          Change Password
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update your administrator account password.
        </p>
      </div>

      {/* Form */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Password
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose a strong password that you do not use
            elsewhere.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          )}

          {message && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm text-emerald-700">
                {message}
              </p>
            </div>
          )}

          {/* Current password */}
          <PasswordField
            id="current_password"
            label="Current password"
            value={form.current_password}
            onChange={handleChange}
            visible={showPassword.current_password}
            onToggle={() =>
              togglePasswordVisibility("current_password")
            }
            autoComplete="current-password"
          />

          {/* New password */}
          <PasswordField
            id="new_password"
            label="New password"
            value={form.new_password}
            onChange={handleChange}
            visible={showPassword.new_password}
            onToggle={() =>
              togglePasswordVisibility("new_password")
            }
            autoComplete="new-password"
            minLength={8}
          />

          <p className="-mt-4 text-xs text-slate-500">
            Must be at least 8 characters.
          </p>

          {/* Confirm password */}
          <PasswordField
            id="confirm_password"
            label="Confirm new password"
            value={form.confirm_password}
            onChange={handleChange}
            visible={showPassword.confirm_password}
            onToggle={() =>
              togglePasswordVisibility("confirm_password")
            }
            autoComplete="new-password"
            minLength={8}
          />

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Changing password..."
                : "Change Password"}
            </button>

          </div>

        </form>
      </section>

    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
  minLength,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <div className="relative mt-2">

        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-12 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            visible
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-slate-600"
        >
          {visible ? (
            <EyeOffIcon />
          ) : (
            <EyeIcon />
          )}
        </button>

      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z"
      />

      <circle
        cx="12"
        cy="12"
        r="3"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.58 10.58a2 2 0 0 0 2.83 2.83"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.88 5.09A10.77 10.77 0 0 1 12 5c4.477 0 8.268 2.943 9.542 7a10.73 10.73 0 0 1-3.13 4.63"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.61 6.61A10.73 10.73 0 0 0 2.458 12c1.274 4.057 5.065 7 9.542 7 1.61 0 3.13-.38 4.47-1.05"
      />
    </svg>
  );
}

export default ChangePassword;