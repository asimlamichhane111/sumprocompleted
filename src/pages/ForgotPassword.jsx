import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { forgotPassword } from "../api/auth";

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
});

const ForgotPassword = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await forgotPassword(data.email);
      setMessage(response.message);
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold">Forgot Password</h2>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white shadow-md rounded-md">
        <input {...register("email")} placeholder="Enter your email" className="input"/>
        <p className="text-red-500">{errors.email?.message}</p>

        <button type="submit" className="btn-primary">Reset Password</button>
      </form>
      <a href="/login" className="text-blue-500">Back to Login</a>
    </div>
  );
};

export default ForgotPassword;
