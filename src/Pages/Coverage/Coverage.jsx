import React, { useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLoaderData } from 'react-router';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const Coverage = () => {
    const position = [23.6850, 90.3563];
    const serviceCenters = useLoaderData();
    const mapRef = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault();
        const location = e.target.location.value;
        const district = serviceCenters.find(center =>
            center.district.toLowerCase().includes(location.toLowerCase())
        );
        if (district) {
            mapRef.current.flyTo([district.latitude, district.longitude], 13);
        }
    };

    return (
        <div className="w-11/12 mx-auto py-14 md:py-20">

            {/* Header */}
            <div className="mb-10">
                <span className="inline-block bg-primary text-accent text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                    Coverage Map
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-secondary mb-3">
                    We are available in 64 districts
                </h1>
                <p className="text-gray-500 text-sm md:text-base max-w-xl">
                    ZapShift covers every district across Bangladesh. Search your district to see our nearest service center.
                </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    { value: "64", label: "Districts" },
                    { value: "500+", label: "Service Centers" },
                    { value: "8", label: "Divisions" },
                    { value: "24/7", label: "Support" },
                ].map((stat, i) => (
                    <div key={i} className="bg-secondary rounded-2xl p-4 text-center">
                        <p className="text-2xl font-extrabold text-primary">{stat.value}</p>
                        <p className="text-gray-300 text-xs mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="max-w-md mb-6">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-2 focus-within:ring-2 focus-within:ring-primary transition-all">
                    <FaSearch className="text-gray-400 flex-shrink-0" />
                    <input
                        type="search"
                        name="location"
                        className="grow text-sm outline-none bg-transparent placeholder:text-gray-400"
                        placeholder="Search district (e.g. Dhaka, Sylhet...)"
                    />
                    <button
                        type="submit"
                        className="btn btn-primary btn-sm text-accent px-4"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Map */}
            <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] rounded-2xl overflow-hidden shadow-md border border-gray-200">
                <MapContainer
                    center={position}
                    zoom={7}
                    scrollWheelZoom={false}
                    className="w-full h-full"
                    ref={mapRef}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {serviceCenters.map((center, index) => (
                        <Marker key={index} position={[center.latitude, center.longitude]}>
                            <Popup>
                                <div className="text-sm">
                                    <p className="font-bold text-secondary flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-red-500" /> {center.district}
                                    </p>
                                    <p className="text-gray-500 mt-1 text-xs">
                                        {center.covered_area?.join(', ')}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* District list */}
            <div className="mt-12">
                <h2 className="text-xl font-bold text-secondary mb-6">All Covered Districts</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {serviceCenters.map((center, i) => (
                        <div
                            key={i}
                            className="bg-neutral border border-gray-200 rounded-xl px-3 py-2 text-center text-sm font-medium text-secondary hover:bg-primary hover:border-primary transition-all duration-200 cursor-default"
                        >
                            {center.district}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Coverage;
