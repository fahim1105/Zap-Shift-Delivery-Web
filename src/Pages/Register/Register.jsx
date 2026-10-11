import React from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import UseAuth from "../../Hooks/UseAuth";
import { Link, useLocation, useNavigate } from "react-router";
import axios from "axios";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { registerUser, signInGoogle, updateUserProfile } = UseAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const axiosSecure = UseAxiosSecure();

    const handleRegister = async (data) => {
        try {
            await registerUser(data.email, data.password);

            const formData = new FormData();
            formData.append("image", data.photo[0]);
            const img_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_Host_Key}`;
            const imgRes = await axios.post(img_API_URL, formData);
            const photoURL = imgRes.data.data.url;

            await updateUserProfile({ displayName: data.name, photoURL });

            const userInfo = {
                email: data.email,
                displayName: data.name,
                photoURL,
                role: "user",
                createdAt: new Date(),
            };
            await axiosSecure.post("/users", userInfo);

            Swal.fire({
                title: "Welcome to ZapShift!",
                text: "Your account has been created successfully.",
                icon: "success",
                confirmButtonColor: "#CAEB66",
                confirmButtonText: "Get Started",
            });
            navigate(location?.state || "/");
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Registration failed. Try again.", "error");
        }
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
        <div className="min-h-screen flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">

                {/* Logo mark */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-4 h-4 bg-primary rotate-45"></div>
                    <span className="font-bold text-secondary text-lg">ZapShift</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold text-secondary">Create an Account</h1>
                <p className="text-gray-500 mt-1 mb-8 text-sm">Join thousands of merchants and individuals.</p>

                <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">

                    {/* Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            {...register("name", { required: "Name is required" })}
                            placeholder="Your full name"
                            className={inputClass}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Photo */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Profile Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("photo", { required: "Photo is required" })}
                            className="file-input file-input-bordered file-input-sm w-full mt-1 rounded-xl border-gray-200"
                        />
                        {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo.message}</p>}
                    </div>

                    {/* Email */}
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

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 8, message: "Minimum 8 characters" },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    message: "Must contain uppercase, lowercase, number & special character"
                                }
                            })}
                            placeholder="Create a strong password"
                            className={inputClass}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-primary text-accent font-bold hover:bg-primary/90 transition-all"
                    >
                        Create Account
                    </button>
                </form>

                <Link state={location?.state} to="/auth/login">
                    <p className="mt-4 text-sm text-gray-500">
                        Already have an account?{" "}
                        <span className="text-secondary font-semibold hover:underline">Login</span>
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

export default Register;
