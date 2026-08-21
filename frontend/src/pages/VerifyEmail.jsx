import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "./VerifyEmail.css";

function VerifyEmail() {
  const { token } = useParams();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyAccount = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      try {
        const response = await api.post(
          "/user/verify",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setStatus("success");
        setMessage(response.data.message || "Email verified successfully.");
      } catch (error) {
        console.error("Email verification failed:", error);

        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Email verification failed. The link may be expired or invalid.",
        );
      }
    };

    verifyAccount();
  }, [token]);

  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="verify-icon">
          {status === "verifying" ? "⏳" : status === "success" ? "✅" : "❌"}
        </div>

        {status === "verifying" && (
          <>
            <h1>Verifying Email</h1>
            <p>Please wait while we verify your email address.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1>Email Verified</h1>
            <p>{message}</p>

            <div className="verify-info">
              Your account is now waiting for administrator approval.
            </div>

            <Link to="/login" className="verify-button">
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h1>Verification Failed</h1>
            <p>{message}</p>

            <Link to="/login" className="verify-button">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
