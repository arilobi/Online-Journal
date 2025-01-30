import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

export const EntryContext = createContext();

export const EntryProvider = ({ children }) => {
  const navigate = useNavigate();
  const { authToken } = useContext(UserContext);

  const [tags, setTags] = useState([]);
  const [entries, setEntries] = useState([]);

  // if i add something, it will change it
  const [onChange, setOnChange] = useState(true);

  //---> TAGS
  useEffect(() => {
    fetch("https://online-journal-45oh.onrender.com/tags", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setTags(response);
      });
  }, []);

  // ----> ENT-RY

  // Fetch Entry
  useEffect(() => {
    fetch("https://online-journal-45oh.onrender.com/entries", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setEntries(response);
      });
  }, [onChange]);

  // Add Entry
  const addEntry = (title, content, tag_id) => {
    alert("Adding entry...");
    fetch("https://online-journal-45oh.onrender.com/entry/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title,
        content,
        tag_id,
      }),
    })
      .then((resp) => resp.json())
      .then((response) => {
        console.log(response);

        if (response.success) {
          alert(response.success);
          setOnChange(!onChange);
        } else if (response.error) {
          alert(response.error);
        } else {
          alert("Failed to add");
        }
      });
  };

  // ---> Update an entry

  const updateEntry = (entry_id, updatedTitle, updatedContent) => {
    alert("Updating entry...");
    fetch(`https://online-journal-45oh.onrender.com/entry/${entry_id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title: updatedTitle,
        content: updatedContent,
      }),
    })
      .then((resp) => resp.json())
      .then((response) => {
        if (response.success) {
          alert(response.success);
          setOnChange(!onChange); //---> updating the state
          navigate("/"); // ---> Redirect after successful update
        } else if (response.error) {
          alert(response.error);
        } else {
          alert("Failed to update");
        }
      })
      .catch((error) => console.error("Error updating entry:", error));
    console.log("Updating entry");
  };
  

  // ---> Delete an entry
  const deleteEntry = (id) => {
    alert("Deleting entry...");
    fetch(`https://online-journal-45oh.onrender.com/entry/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((resp) => resp.json())
      .then((response) => {
        if (response.success) {
          alert(response.success);
          setOnChange(!onChange);
          navigate("/");
        } else if (response.error) {
          alert(response.error);
        } else {
          alert("Failed to delete");
        }
      });
  };

  const data = {
    entries,
    tags,

    addEntry,
    updateEntry,
    deleteEntry,
  };

  return (
    <EntryContext.Provider value={data}>
      {children}
    </EntryContext.Provider>
  );
};
