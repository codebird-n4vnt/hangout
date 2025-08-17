import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from 'react-hot-toast'
import {
  Eye,
  EyeClosed,
  KeyRound,
  Loader2,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { signUp, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.username.trim()) return toast.error("Full name is required")
    if (!formData.email.trim()) return toast.error("Email is required")
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format")
    if (!formData.password.trim()) return toast.error("Password is required")
    if (formData.password.length < 6) return toast.error("Password must be atleast 6 characters long")

    return true
  };
  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    const success = validateForm();
    console.log(success)
    if(success === true) await signUp(formData);
    
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side*/}

      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb:8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                {" "}
                Get Started with your free account
              </p>
            </div>
          </div>
          <form onSubmit={(e)=>handleSubmit(e)} className="space-y-6">
            <div className="form-control">
              <label htmlFor="" className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10 bg-transparent`}
                  placeholder="John doe"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label htmlFor="" className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10 bg-transparent`}
                  placeholder="abc@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="" className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10 bg-transparent`}
                  placeholder="************"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <div
                  className="absolute inset-y-2.5 right-0 pr-3 z-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {!showPassword ? (
                    <Eye className="size-5 text-base-content/40 hover:text-blue-50 transition-colors duration-200 ease-out" />
                  ) : (
                    <EyeClosed className="size-5 text-base-content/40 hover:text-blue-50 transition-colors duration-200 ease-out" />
                  )}
                </div>
              </div>
            </div>

            <button className="btn btn-primary w-full " disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="link link-accent">
              Sign in
            </Link>
            </p>
            
          </div>
        </div>
      </div>

      <AuthImagePattern
      title="Join our community"
      subtitle="Connect with friends, share moments, and stay in touch with your family"
      />
    </div>
  );
};

export default SignUpPage;
