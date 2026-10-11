import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import UseAuth from "../../Hooks/UseAuth";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../Firebase/firebase.init";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
    const { register, formState: { errors }, handleSubmit, getValues } = useForm();
    const { signinUser, signInGoogle } = UseAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const axiosSecure = UseAxiosSecure();
    const [resettingPassword, setResettingPassword] = useState(false);

    const handleLogin = (data) => {
        signinUser(data.email, data.password)
            .then(() => navigate(location?.state || '/'))
            .catch((error) => {
                console.log(error);
                toast.error("Invalid email or password.");
            });
    };

    const handleForgotPassword = () => {
        const email = getValues("email");
        if (!email) {
            toast.error("Please enter your email address first.");
            return;
        }
        setResettingPassword(true);
        sendPasswordResetEmail(auth, email)
            .then(() => toast.success(`Password reset email sent to ${email}.`))
            .catch((error) => {
                if (error.code === "auth/user-not-found") {
                    toast.error("No account found with this email.");
                } else {
                    toast.error("Failed to send reset email. Try again.");
                }
            })
            .finally(() => setResettingPassword(false));
    };

    const handleGoogleLogin = () => {
        signInGoogle()
            .then((result) => {
                const userInfo = {
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL,
                };
                axiosSecure.post('/users', userInfo).then(() => {
                    navigate(location?.state || '/');
                });
            })
            .catch((error) => console.log(error));
    };

    const inputClass = "w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white";

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm">

                {/* Logo mark */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-4 h-4 bg-primary rotate-45"></div>
                    <span className="font-bold text-secondary text-lg">ZapShift</span>
                </div>

                <h1 className="text-3xl font-extrabold text-secondary mb-1">Welcome Back</h1>
                <p className="text-gray-500 text-sm mb-8">Login to your ZapShift account</p>

                <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            placeholder="you@example.com"
                            className={inputClass}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                disabled={resettingPassword}
                                className="text-xs text-secondary hover:underline disabled:opacity-60"
                            >
                                {resettingPassword ? "Sending..." : "Forgot Password?"}
                            </button>
                        </div>
                        <input
                            type="password"
                            {...register("password", { required: "Password is required" })}
                            placeholder="Your password"
                            className={inputClass}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-primary text-accent font-bold hover:bg-primary/90 transition-all"
                    >
                        Login
                    </button>
                </form>

                <Link state={location?.state} to="/auth/register">
                    <p className="text-sm text-gray-500 mt-4">
                        Don't have an account?{" "}
                        <span className="text-secondary font-semibold hover:underline">Register</span>
                    </p>
                </Link>

                <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-gray-400 text-xs">OR</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition font-medium text-gray-700 text-sm shadow-sm"
                >
                    <FcGoogle size={20} />
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
