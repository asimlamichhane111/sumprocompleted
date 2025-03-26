import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { resetPassword } from "../api/auth";

const schema = yup.object().shape({
  password: yup.string().min(6, "Password must be at least 6 characters").required(),
  confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required(),
});

const ResetPassword = () => {
  const { token } = useParams();  // Get token from URL
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await resetPassword(token, data.password);
      setMessage(response.message);
      setTimeout(() => navigate("/login"), 2000);  // Redirect to login
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold">Reset Password</h2>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white shadow-md rounded-md">
        <input {...register("password")} type="password" placeholder="New Password" className="input"/>
        <p className="text-red-500">{errors.password?.message}</p>

        <input {...register("confirmPassword")} type="password" placeholder="Confirm Password" className="input"/>
        <p className="text-red-500">{errors.confirmPassword?.message}</p>

        <button type="submit" className="btn-primary">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
