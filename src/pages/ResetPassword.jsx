import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [form, setForm] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!token) {
      setError(
        "This password reset link is invalid or incomplete."
      );
      return;
    }

    if (form.new_password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (form.new_password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/reset-password",
        {
          token,
          new_password: form.new_password,
          confirm_password: form.confirm_password,
        }
      );

      setMessage(
        response.data.message ||
        "Password reset successfully."
      );

      setForm({
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error(
        "Failed to reset password:",
        error
      );

      setError(
        error.response?.data?.error ||
        "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-gray-900">
            Optocare
          </h1>

          <p className="mt-2 text-gray-500">
            Reset your password
          </p>

        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        {!message && (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* New password */}

            <div>

              <label
                htmlFor="new_password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                New password
              </label>

              <div className="relative">

                <input
                  id="new_password"
                  name="new_password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={form.new_password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-400 transition hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOffIcon />
                  ) : (
                    <EyeIcon />
                  )}
                </button>

              </div>

              <p className="mt-2 text-xs text-gray-500">
                Must be at least 8 characters.
              </p>

            </div>

            {/* Confirm password */}

            <div>

              <label
                htmlFor="confirm_password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm new password
              </label>

              <div className="relative">

                <input
                  id="confirm_password"
                  name="confirm_password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={form.confirm_password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="Confirm new password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-400 transition hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon />
                  ) : (
                    <EyeIcon />
                  )}
                </button>

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-teal-700 px-4 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Resetting password..."
                : "Reset Password"}
            </button>

          </form>
        )}

        {message && (
          <Link
            to="/login"
            className="block w-full rounded-lg bg-teal-700 px-4 py-3 text-center font-semibold text-white transition hover:bg-teal-800"
          >
            Return to Login
          </Link>
        )}

        {!message && (
          <div className="mt-6 text-center">

            <Link
              to="/login"
              className="text-sm font-medium text-teal-700 hover:text-teal-800"
            >
              ← Back to login
            </Link>

          </div>
        )}

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

export default ResetPassword;