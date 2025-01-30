import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import frogProfile from "../assets/frogProfile.jpeg";

export default function Profile() {
  const { current_user, updateUser } = useContext(UserContext); // ---> Assuming `updateUser` is a function to update the user
  const [editMode, setEditMode] = useState(false); // ---> State to toggle between edit/view mode
  const [updatedName, setUpdatedName] = useState(current_user ? current_user.name : "");
  const [updatedEmail, setUpdatedEmail] = useState(current_user ? current_user.email : "");

  useEffect(() => {
    // ---> Whenever the current_user changes, update the local state for profile
    if (current_user) {
      setUpdatedName(current_user.name);
      setUpdatedEmail(current_user.email);
    }
  }, [current_user]);

  const handleUpdateProfile = () => {
    // ---> When the update button is clicked, toggle edit mode
    setEditMode(true);
  };

  const handleSaveProfile = () => {
    // ---> Save the updated information and pass userId to the updateUser function
    const userId = current_user.id; // Assuming current_user has an id field

    updateUser(userId, updatedName, updatedEmail); // ---> Call the context function to update user data

    // ---> Exit edit mode
    setEditMode(false);
  };

  return (
    <>
      {!current_user ? (
        "Not authorized"
      ) : (
        <div className="container">
          <div className="profile">
            <img src={frogProfile} alt="Profile Photo" />

            <p>
              <strong>Name:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                />
              ) : (
                current_user.name
              )}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {editMode ? (
                <input
                  type="email"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                />
              ) : (
                current_user.email
              )}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {current_user.is_verified ? "Verified" : "Pending Verification"}
            </p>

            <div className="btn">
              {editMode ? (
                <button className="save-btn" onClick={handleSaveProfile}>
                  Save
                </button>
              ) : (
                <button className="update-btn" onClick={handleUpdateProfile}>
                  Update
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
