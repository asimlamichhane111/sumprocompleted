import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
});

const Login = () => {
  const [error, setError] = useState("");
  const {login}=useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data.email, data.password);
      console.log("Login response:", response);

      localStorage.setItem("access_token", response.token);
      localStorage.setItem("refresh_token",response.refresh);// added at last change probably will be removed
      localStorage.setItem("role", response.role);

      login(response.token,response.role);
      console.log("login successful");
      navigate("/home"); // Redirect after login
      console.log(localStorage.getItem("access_token"));

    } catch (err) {
      setError("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
      <h2 className="auth-title">Login</h2>
      {error && <p className="auth-error">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white shadow-md rounded-md">
        <input {...register("email")} placeholder="Email" className="auth-input"/>
        <p className="auth-error">{errors.email?.message}</p>

        <input type="password" {...register("password")} placeholder="Password" className="input"/>
        <p className="auth-error">{errors.password?.message}</p>

        <button type="submit" className="auth-button">Login</button>
      </form>
      <a href="/register" className="auth-link">Don't have an account? Register</a>
      </div>
    </div>
  );
};

export default Login;
