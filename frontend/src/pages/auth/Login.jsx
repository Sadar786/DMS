//src/pages/auth/Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

import { useAuth } from "../../context/AuthContext";
import {Button , Input } from "../../ui"

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(values) {
    try {
      await login(values.email, values.password);

      toast.success("Login successful");

      navigate("/");
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center">
          Pepsi DMS
        </h1>

        <p className="mt-2 text-center text-slate-500">
          Distribution Management System
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5"
        >
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
            })}
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            error={errors.password?.message}
            rightIcon={
              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            }
            {...register("password", {
              required: "Password is required",
            })}
          />

          <Button
            type="submit"
            loading={isSubmitting}
            className="w-full"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}