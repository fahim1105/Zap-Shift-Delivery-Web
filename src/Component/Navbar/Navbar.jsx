import React, { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import logo from "../../assets/Group 3.png";
import { Link, NavLink } from "react-router";
import UseAuth from "../../Hooks/UseAuth";
import { MdDashboardCustomize } from "react-icons/md";

const Navbar = () => {
    const { user, signOutUser } = UseAuth()
    const [open, setOpen] = useState(false);
    const handleSignOut = () => {
        signOutUser()
            .then(() => {
                // Sign-out successful.
            }).catch((error) => {
                console.log(error)
                const errorMessage = error.message;
                console.log(errorMessage)
            });
    }

    const DesktopLinks = (
        <>
            <div className="hidden lg:flex items-center space-x-10 text-gray-700 font-medium">
                <NavLink
                    to="/services"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-primary px-8 py-2 rounded-3xl text-accent"
                            : "hover:text-black"
                    }
                >
                    Services
                </NavLink>

                <NavLink
                    to="/coverage"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-primary px-8 py-2 rounded-3xl text-accent"
                            : "hover:text-black"
                    }
                >
                    Coverage
                </NavLink>

                <NavLink
                    to="/about"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-primary px-8 py-2 rounded-3xl text-accent"
                            : "hover:text-black"
                    }
                >
                    About Us
                </NavLink>

                <NavLink
                    to="/send-parcel"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-primary px-8 py-2 rounded-3xl text-accent"
                            : "hover:text-black"
                    }
                >
                    Send Parcel
                </NavLink>

                <NavLink
                    to="/be-a-rider"
                    className={({ isActive }) =>
                        isActive
                            ? "bg-primary px-8 py-2 rounded-3xl text-accent"
                            : "hover:text-black"
                    }
                >
                    Be a Rider
                </NavLink>
                {
                    user &&
                    <>
                        <NavLink
                            to="/dashboard/my-parcels"
                            className={({ isActive }) =>
                                isActive
                                    ? "bg-primary px-8 py-2 rounded-3xl text-accent"
                                    : "hover:text-black"
                            }
                        >
                            <span className="flex gap-1 items-center">
                                Dashboard
                                <MdDashboardCustomize />
                            </span>
                        </NavLink>
                    </>
                }
            </div>

            <div className="hidden lg:flex items-center space-x-4">

                {
                    user ? <button onClick={handleSignOut} className="bg-primary px-6 py-2 rounded-xl font-medium hover:bg-primary/80">
                        Sign Out
                    </button>
                        : <div className="flex items-center gap-3">
                            <Link to="/auth/login">
                                <button className="border border-gray-300 px-6 py-2 rounded-xl text-gray-700 font-medium hover:bg-gray-100">
                                    Sign In
                                </button>
                            </Link>

                            <Link to="/auth/register">
                                <button className="bg-primary px-6 py-2 rounded-xl font-medium hover:bg-primary/80">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                }

                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                    <ArrowUpRight className="text-primary w-5 h-5" />
                </div>
            </div>
        </>
    );

    return (
        <nav className="w-full bg-white shadow-sm px-4 lg:px-10 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Logo */}
                <Link to="/">
                    <div className="flex items-center space-x-2">
                        <img src={logo} alt="ZapShift" className="w-28 object-contain" />
                    </div>
                </Link>

                {/* Desktop Links */}
                {DesktopLinks}

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {open && (
                <div className="lg:hidden mt-4 flex flex-col space-y-4 text-gray-700 font-medium">
                    <NavLink
                        to="/services"
                        className={({ isActive }) =>
                            isActive
                                ? "bg-primary text-accent px-6 py-2 rounded-xl block"
                                : "hover:text-black px-6 py-2 block"
                        }
                    >
                        Services
                    </NavLink>

                    <NavLink
                        to="/coverage"
                        className={({ isActive }) =>
                            isActive
                                ? "bg-primary text-accent px-6 py-2 rounded-xl block"
                                : "hover:text-black px-6 py-2 block"
                        }
                    >
                        Coverage
                    </NavLink>

                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            isActive
                                ? "bg-primary text-accent px-6 py-2 rounded-xl block"
                                : "hover:text-black px-6 py-2 block"
                        }
                    >
                        About Us
                    </NavLink>

                    <NavLink
                        to="/send-parcel"
                        className={({ isActive }) =>
                            isActive
                                ? "bg-primary text-accent px-6 py-2 rounded-xl block"
                                : "hover:text-black px-6 py-2 block"
                        }
                    >
                        Send Parcel
                    </NavLink>

                    <NavLink
                        to="/be-a-rider"
                        className={({ isActive }) =>
                            isActive
                                ? "bg-primary text-accent px-6 py-2 rounded-xl block"
                                : "hover:text-black px-6 py-2 block"
                        }
                    >
                        Be a Rider
                    </NavLink>
                    {
                        user &&
                        <div className="ml-6 mt-2">
                            <NavLink
                                to="/dashboard/my-parcels"
                                className={({ isActive }) =>
                                    isActive
                                        ? "bg-primary px-8 py-2 rounded-3xl text-accent"
                                        : "hover:text-black"
                                }
                            >
                                <span className="flex gap-1 items-center">
                                    Dashboard
                                    <MdDashboardCustomize />
                                </span>
                            </NavLink>
                        </div>
                    }
                    <hr className="my-2" />


                    {
                        user ? <button onClick={handleSignOut} className="bg-primary px-6 py-2 rounded-xl font-medium hover:bg-primary/80 w-xs">
                            Sign Out
                        </button>
                            : <div className="flex items-start flex-col gap-2">
                                <Link to="/auth/login">
                                    <button className="border border-gray-300 px-6 py-2 rounded-xl text-gray-700 font-medium hover:bg-gray-100 w-xs">
                                        Sign In
                                    </button>
                                </Link>

                                <Link to="/auth/register">
                                    <button className="bg-primary px-6 py-2 rounded-xl font-medium hover:bg-primary/80 w-xs">
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                    }

                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                        <ArrowUpRight className="text-primary w-5 h-5" />
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
