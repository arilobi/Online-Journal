import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("token"));
  const [current_user, setCurrentUser] = useState(null);

  console.log("Current user ", current_user);

  // LOGIN
  const login = (email, password) => {
    alert("Logging you in...");
    fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((resp) => resp.json())
      .then((response) => {
        if (response.access_token) {
          alert("Login successful!");
          sessionStorage.setItem("token", response.access_token);
          setAuthToken(response.access_token);

          fetch("http://127.0.0.1:5000/current_user", {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${response.access_token}`,
            },
          })
            .then((response) => response.json())
            .then((response) => {
              if (response.email) {
                setCurrentUser(response);
              }
            });

          navigate("/");
        } else if (response.error) {
          alert(`Error: ${response.error}`);
        } else {
          alert("Failed to login");
        }
      });
  };

  const logout = () => 
    {
        alert("Logging out ...");
        
        fetch("http://127.0.0.1:5000/logout",{
            method: "DELETE",
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${authToken}`
            },
        })
        .then((resp) => resp.json())
        .then((response) => {
            console.log(response);
            
            if (response.success) {
                sessionStorage.removeItem("token");
                setAuthToken(null);
                setCurrentUser(null);
    
                alert("Successfully Logged out");
    
                navigate("/login");
            }
        })
        .catch((error) => {
            console.error("Error logging out:", error);
            alert("Failed to log out.");
        });
    };
    

  // Fetch current user
  useEffect(() => {
    if (authToken) {
      fetchCurrentUser();
    }
  }, [authToken]);
  const fetchCurrentUser = () => {
    console.log("Current user fcn ", authToken);

    fetch("http://127.0.0.1:5000/current_user", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.email) {
          setCurrentUser(response);
        }
      });
  };

  // ADD user
  const addUser = (name, email, password) => {
    alert("Registering...");
    fetch("http://127.0.0.1:5000/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
      .then((resp) => resp.json())
      .then((response) => {
        if (response.success) {
          alert(response.success);
          navigate("/login");
        } else if (response.error) {
          alert(`Error: ${response.error}`);
        } else {
          alert("Failed to add user");
        }
      });
  };
// UPDATE USER
  const updateUser = (user_id, updatedName, updatedEmail) => {
    console.log("Updating user:", user_id);
    alert("Updating User...");
    fetch(`http://127.0.0.1:5000/users/${user_id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name: updatedName,
        email: updatedEmail,
      }),
    })
      .then((resp) => resp.json())
      .then((response) => {
        if (response.success) {
          alert("User updated successfully!");
          // Optionally refresh the current user data
          fetchCurrentUser();
        } else if (response.error) {
          alert(`Error: ${response.error}`);
        } else {
          alert("Failed to update user");
        }
      });
  };
  

  const deleteUser = async (user_id) => {
    console.log("Deleting user:", user_id);
  
    fetch(`http://127.0.0.1:5000/users/${user_id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          alert("User deleted successfully!");
          logout(); // Log the user out after deletion
          navigate("/login"); // Redirect to login page
        } else if (response.error) {
          alert(`Error: ${response.error}`);
        } else {
          alert("Failed to delete user");
        }
      });
  };
  
  const data = {
    authToken,
    login,
    current_user,
    logout,
    addUser,
    updateUser,
    deleteUser,
  };

  return (
    <UserContext.Provider value={data}>
      {children}
    </UserContext.Provider>
  );
};
