import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/verify-email/", { token });
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 3000); // Redirect after 3s
    } catch (err) {
      setError("Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        {loading ? (
          <p>Verifying your email...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-green-500">{message}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
