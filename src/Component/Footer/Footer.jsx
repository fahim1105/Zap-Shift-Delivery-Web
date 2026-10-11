import { Linkedin, Facebook } from "lucide-react";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";
import { Link } from "react-router";

const Footer = () => {
    return (
        <footer className="w-full bg-accent rounded-3xl text-white py-12 sm:py-16 px-4">
            <div className="max-w-6xl mx-auto text-center flex flex-col items-center">

                {/* Logo */}
                <div className="flex justify-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-[#C7FF33] rotate-45"></div>
                        <h1 className="text-2xl sm:text-3xl font-semibold">ZapShift</h1>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 mt-4 max-w-xl text-sm sm:text-base px-2">
                    Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle.
                    From personal packages to business shipments — we deliver on time, every time.
                </p>

                {/* Divider */}
                <div className="w-full my-8 sm:my-10 border-t border-dashed border-gray-700"></div>

                {/* Nav Links */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-10 text-gray-300 text-sm sm:text-base">
                    <Link to="/services" className="hover:text-white transition-colors">Services</Link>
                    <Link to="/coverage" className="hover:text-white transition-colors">Coverage</Link>
                    <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
                    <Link to="/send-parcel" className="hover:text-white transition-colors">Send Parcel</Link>
                    <Link to="/be-a-rider" className="hover:text-white transition-colors">Be a Rider</Link>
                    <Link to="/auth/login" className="hover:text-white transition-colors">Login</Link>
                </div>

                {/* Divider */}
                <div className="w-full my-8 sm:my-10 border-t border-dashed border-gray-700"></div>

                {/* Social Icons */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"
                        aria-label="LinkedIn"
                    >
                        <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                    </a>

                    <a
                        href="https://x.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"
                        aria-label="X (Twitter)"
                    >
                        <FaXTwitter className="w-5 h-5 text-white" />
                    </a>

                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"
                        aria-label="Facebook"
                    >
                        <Facebook className="w-5 h-5 text-[#1877F2]" />
                    </a>

                    <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"
                        aria-label="YouTube"
                    >
                        <FaYoutube className="w-5 h-5 text-red-600" />
                    </a>
                </div>

                {/* Copyright */}
                <p className="text-gray-500 text-xs mt-8">
                    © {new Date().getFullYear()} ZapShift. All rights reserved.
                </p>

            </div>
        </footer>
    );
};

export default Footer;
