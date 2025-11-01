import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadUserProfile } from "@/store/userProfileSlice";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const dispatch = useDispatch();
  const { profile: user, loadingProfile: loading, error } = useSelector(
    (state) => state.userProfile
  );
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    
    console.log("=== UserProfile Debug ===");
    console.log("Token exists:", !!token);
    console.log("Current user:", user);
    console.log("Loading:", loading);
    console.log("Error:", error);
    
    if (token && !user) {
      console.log("Dispatching loadUserProfile...");
      dispatch(loadUserProfile());
    } else if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/v1/login");
    }
  }, [dispatch, navigate, user]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Profile</h2>
          <p className="text-red-600 text-sm mb-4">
            {error.message || JSON.stringify(error)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => dispatch(loadUserProfile())}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                navigate("/v1/login");
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No user state (shouldn't happen with useEffect redirect)
  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
          <p className="text-sm text-yellow-800 mb-3">You are not signed in.</p>
          <button
            onClick={() => navigate("/v1/login")}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Success state - render profile
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">User Profile</h1>
      
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl">
        {/* Avatar and Name */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-2xl">
            {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <div className="text-xl font-semibold">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          {/* User ID */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium text-muted-foreground">User ID</div>
            <div className="col-span-2 text-sm font-mono">{user.id}</div>
          </div>

          {/* Phone */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium text-muted-foreground">Phone</div>
            <div className="col-span-2 text-sm">
              {user.phoneNumber || <span className="text-gray-400">Not provided</span>}
            </div>
          </div>

          {/* Authorities/Roles */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium text-muted-foreground">Roles</div>
            <div className="col-span-2 text-sm">
              {user.authorityList && user.authorityList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.authorityList.map((authority, i) => {
                    // Handle both string and object formats
                    const roleText = typeof authority === 'string' 
                      ? authority 
                      : authority.authority || authority.roleCode;
                    
                    return (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                      >
                        {roleText}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <span className="text-gray-400">No roles assigned</span>
              )}
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium text-muted-foreground">Addresses</div>
            <div className="col-span-2 text-sm">
              {user.addressList && user.addressList.length > 0 ? (
                <div className="space-y-2">
                  {user.addressList.map((address, i) => (
                    <div
                      key={i}
                      className="p-2 bg-gray-50 rounded border border-gray-200"
                    >
                      {typeof address === "string" ? address : JSON.stringify(address)}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400">No addresses added</span>
              )}
            </div>
          </div>
        </div>

        {/* Debug Info (remove in production) */}
        {import.meta.env.DEV && (
          <details className="mt-6 pt-6 border-t">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
              Debug Info (dev only)
            </summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}