import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(6).required("Password must be at least 6 characters"),
  phone: yup.string().required("Telephone number is required"),
  role: yup.string().oneOf(["customer", "owner"], "Select a valid role").required("Role is required"),
});

const Register = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log("Form Data:",data);
    try {
      await registerUser(data.name, data.email, data.password, data.phone,data.role);
      navigate("/login"); // Redirect to login after successful registration
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="register-box">
      <h2 className="auth-title">Register</h2>
      {error && <p className="auth-error">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <input type="text"{ ...register("name")} placeholder="Full Name" className="auth-input"/>
        <p className="auth-error">{errors.name?.message}</p>

        <input type="text"{...register("email")} placeholder="Email" className="auth-input"/>
        <p className="auth-error">{errors.email?.message}</p>

        <input type="password" {...register("password")} placeholder="Password" className="auth-input"/>
        <p className="auth-error">{errors.password?.message}</p>

        <input type="tel" {...register("phone")} placeholder="Phone number"  maxLength="12"  className="auth-input"/> 
        <p className="auth-error">{errors.phone?.message}</p>

        <select {...register("role")} className="auth-input">
          <option value="">Select Role</option>
          <option value="customer">Customer</option>
          <option value="owner">Store Owner</option>
        </select>
        <p className="auth-error">{errors.role?.message}</p>

        <button type="submit" className="auth-button">Register</button>
      </form>
      <a href="/login" className="auth-link">Already have an account? Login</a>
      </div>
      </div>
  );
};

export default Register;
