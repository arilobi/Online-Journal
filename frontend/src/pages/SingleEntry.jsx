import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { EntryContext } from "../context/EntryContext";

export default function SingleEntry() {
  const { id } = useParams();
  const { entries, updateEntry } = useContext(EntryContext);

  // Find the entry by its ID
  const entry = entries && entries.find((entry) => entry.id == id);

  // State for toggling edit mode
  const [editMode, setEditMode] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");

  useEffect(() => {
    if (entry) {
      setUpdatedTitle(entry.title);
      setUpdatedContent(entry.content);
    }
  }, [entry]); // Only run when `entry` changes

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    updateEntry(id, updatedTitle, updatedContent);
    setEditMode(false);
  };

  if (!entry) return <div>Entry not found</div>;

  return (
    <div className="single-entry">
      <h1 className="single-title">
        {editMode ? (
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
        ) : (
          entry.title
        )}
      </h1>
      <p className="single-content">
        {editMode ? (
          <textarea
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
          />
        ) : (
          entry.content
        )}
      </p>

      <div className="single-tag" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {editMode ? (
          <button className="save-btn" style={{ padding: "10px", paddingLeft: "5px" }} onClick={handleSave}>
            Save
          </button>
        ) : (
          <button className="edit-btn" style={{ padding: "10px", paddingLeft: "5px" }} onClick={handleEdit}>
            Edit
          </button>
        )}
        <p className="entry-tag">{entry.tag?.name}</p>
      </div>

      <div className="se-home">
        <p className="single-date">entry made on: {entry.date_created}</p>
        <h6>_____________________________________________________</h6>
      </div>
    </div>
  );
}
