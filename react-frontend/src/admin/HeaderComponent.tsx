import React, { useState } from 'react';

const HeaderComponent = () => {
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

    return (
        <nav className="bg-white text-black py-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center px-4">
                <div className='flex flex-row gap-12'>  {/* Logo */}
                    <a href="/" className="text-xl font-bold">
                        Bookish Vibe
                    </a>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-6 items-center">
                        <a href="#" className="hover:text-gray-600 transition">Home</a>
                        <a href="#" className="hover:text-gray-600 transition">About</a>
                        <a href="#" className="hover:text-gray-600 transition">Contact</a>

                        {/* Categories Mega Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                                className="hover:text-gray-600 transition focus:outline-none"
                            >
                                Categories ▼
                            </button>

                            {isCategoriesOpen && (
                                <div
                                    className="absolute left-0 mt-2 w-64 bg-white shadow-lg border rounded-md p-4"
                                    onMouseLeave={() => setIsCategoriesOpen(false)}
                                >
                                    <ul className="space-y-2">
                                        <li><a href="#" className="block hover:text-blue-500 transition">Fiction</a></li>
                                        <li><a href="#" className="block hover:text-blue-500 transition">Non-Fiction</a></li>
                                        <li><a href="#" className="block hover:text-blue-500 transition">Mystery & Thriller</a></li>
                                        <li><a href="#" className="block hover:text-blue-500 transition">Sci-Fi & Fantasy</a></li>
                                        <li><a href="#" className="block hover:text-blue-500 transition">Self-Help</a></li>
                                        <li><a href="#" className="block hover:text-blue-500 transition">Children's Books</a></li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                {/* User Login/Logout Section */}
                <div className="flex items-center space-x-4">
                    <span className="hidden md:block font-semibold">Hello, John Doe</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default HeaderComponent;
