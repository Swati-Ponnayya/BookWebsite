import React, { useEffect, useState } from "react";
import {
  getUserProfile,
  updateUserProfile,
  updateUserRole,
} from "../../services/UserServices";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const SettingPage = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // For seller confirmation

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        console.log(response);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Load user data
  useEffect(() => {
    // axios
    //   .get("/api/users/me", {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((res) => {
    //     setUser(res.data);
    //   });
  }, []);

  // Save changes
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const userData = {
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      address: user.address,
    };
    console.log(userData);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/users/update-profile`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Profile updated successfully:", response);
    } catch (error) {
      // Log the entire error to see details
      console.error(
        "Error response:",
        error.response ? error.response.data : error.message
      );

      // Specifically log the status code to verify the exact issue
      if (error.response) {
        console.error("Status Code:", error.response.status); // Should log 403
        console.error("Error Data:", error.response.data); // Should contain any error message from the backend
      }
    }
  };

  const handleConfirmBecomeSeller = async () => {
    try {
      const response = await updateUserRole("SELLER");
      setUser((prev) => ({ ...prev, role: response.data.role }));
      setShowModal(false);
      alert("You are now a seller!");
    } catch (err) {
      console.error("Error updating role:", err);
      setError("Failed to update role");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error || !user)
    return (
      <p className="text-center text-red-500 mt-10">
        {error || "User not found"}
      </p>
    );

  return (
    <div className="w-full py-6 bg-[#FCF9DC] min-h-screen">
      <div className=" mx-auto my-6 p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white p-6 rounded-lg shadow w-full">
          <h2 className="text-2xl font-bold text-[#764932] mb-4">Settings</h2>
          <div className="flex flex-col space-y-2">
            {[
              { label: "Profile", value: "profile" },
              { label: "Security", value: "security" },
              { label: "Seller", value: "seller" },
              { label: "Activity", value: "activity" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedTab(tab.value)}
                className={`p-3 rounded-lg text-left ${
                  selectedTab === tab.value
                    ? "bg-[#875332] text-white font-bold"
                    : " text-[#875332]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white p-6 rounded-lg shadow w-full h-full flex flex-col col-span-3">
          {selectedTab === "profile" && (
            <div>
              <h2 className="text-2xl font-bold text-[#764932] mb-6">
                Profile{" "}
              </h2>
              <input
                type="text"
                value={user.fullName || ""}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                className="w-full mt-3 p-3 border border-gray-300 rounded-lg"
                placeholder="Full Name"
              />
              <input
                type="number"
                value={user.phoneNumber || ""}
                onChange={(e) =>
                  setUser({ ...user, phoneNumber: e.target.value })
                }
                className="w-full mt-3 p-3 border border-gray-300 rounded-lg"
                placeholder="Phone Number"
              />
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full mt-3 p-3 border border-gray-300 rounded-lg bg-gray-100"
                placeholder="Email Address"
              />

              <input
                type="text"
                value={user.address || ""}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
                placeholder="Address"
              />
              <button
                onClick={handleSave}
                className="mt-6 px-6 py-3 bg-[#764932] text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          )}

          {selectedTab === "security" && (
            <div>
              <h2 className="text-2xl font-bold text-[#764932] mb-6">
                Security
              </h2>
              <input
                type="password"
                className="w-full mt-3 p-3 border border-gray-300 rounded-lg"
                placeholder="Current Password"
              />
              <input
                type="password"
                className="w-full mt-3 p-3 border border-gray-300 rounded-lg"
                placeholder="New Password"
              />
              <input
                type="password"
                className="w-full mt-3 p-3 border border-gray-300 rounded-lg"
                placeholder="Confirm New Password"
              />
              <button className="mt-4 w-full bg-[#875332] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#764932]">
                Update Password
              </button>
            </div>
          )}

          {/* Seller Tab */}
          {selectedTab === "seller" && (
            <div>
              <h2 className="text-2xl font-bold text-[#764932] mb-6">Seller</h2>
              <p className="mb-4">
                Want to sell books? Upgrade your role to a seller.
              </p>
              {user.role === "SELLER" ? (
                <p className="text-green-600 font-semibold">
                  You are already a seller.
                </p>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-[#F8DAAB] text-[#875332] py-2 px-6 rounded hover:bg-[#CEA882]"
                >
                  Become a Seller
                </button>
              )}
            </div>
          )}
          {selectedTab === "activity" && (
            <div>
              <h2 className="text-2xl font-bold text-[#764932] mb-6">
                Activity
              </h2>

              <div className="space-y-4 w-1/2">
                <Link
                  to="/liked-books"
                  className="block text-lg font-medium text-[#764932] hover:text-white hover:bg-[#764932] rounded-lg px-4 py-2 transition-all duration-300"
                >
                  Books You Have Liked
                </Link>

                <Link
                  to="/order"
                  className="block text-lg font-medium text-[#764932] hover:text-white hover:bg-[#764932] rounded-lg px-4 py-2 transition-all duration-300"
                >
                  Order History
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold text-[#764932] mb-4">
              Confirm Action
            </h3>
            <p className="mb-6">Are you sure you want to become a seller?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBecomeSeller}
                className="px-4 py-2 rounded bg-[#875332] text-white hover:bg-[#764932]"
              >
                Yes, I'm sure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingPage;
