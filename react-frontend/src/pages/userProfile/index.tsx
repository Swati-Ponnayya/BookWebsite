import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserRole } from "../../services/authService";

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
      <div className="max-w-6xl mx-auto my-10 p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white p-6 rounded-lg shadow w-full">
          <h2 className="text-2xl font-bold text-[#764932] mb-4">Settings</h2>
          <div className="flex flex-col space-y-2">
            {[
              { label: "Profile", value: "profile" },
              { label: "Address", value: "address" },
              { label: "Security", value: "security" },
              { label: "Seller", value: "seller" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedTab(tab.value)}
                className={`p-3 rounded-lg text-left ${
                  selectedTab === tab.value
                    ? "bg-[#875332] text-white font-bold"
                    : "bg-gray-200 text-gray-700"
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
              <h2 className="text-2xl font-bold text-[#764932] mb-6">Profile</h2>
              <input
                type="text"
                value={user.fullName || ""}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                className="w-full mt-3 p-3 border border-gray-300 rounded-lg"
                placeholder="Full Name"
              />
              <input
                type="text"
                value={user.phone || ""}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
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
              <div className="mt-4 text-lg">
                <strong>Role:</strong>{" "}
                <span className="text-[#875332] font-semibold">{user.role}</span>
              </div>
            </div>
          )}

          {selectedTab === "address" && (
            <div>
              <h2 className="text-2xl font-bold text-[#764932] mb-6">Address</h2>
              <input
                type="text"
                value={user.city || ""}
                onChange={(e) => setUser({ ...user, city: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg w-full mt-2"
                placeholder="City"
              />
              <input
                type="text"
                value={user.state || ""}
                onChange={(e) => setUser({ ...user, state: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg w-full mt-2"
                placeholder="State"
              />
              <input
                type="text"
                value={user.zip || ""}
                onChange={(e) => setUser({ ...user, zip: e.target.value })}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
                placeholder="ZIP Code"
              />
              <input
                type="text"
                value={user.address || ""}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
                placeholder="Street Address"
              />
            </div>
          )}

          {selectedTab === "security" && (
            <div>
              <h2 className="text-2xl font-bold text-[#764932] mb-6">Security</h2>
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
                <p className="text-green-600 font-semibold">You are already a seller.</p>
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
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
       <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold text-[#764932] mb-4">Confirm Action</h3>
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
