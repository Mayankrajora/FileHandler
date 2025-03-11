import React, { useState } from "react";
import Axios from "axios";
import "./UploadForm.css";

export default function UploadForm() {
  const [files, setFiles] = useState([]);
  const [uniqueKey, setUniqueKey] = useState("");
  const [groupName, setGroupName] = useState("");

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const uploadFiles = async () => {
    if (!files.length || !uniqueKey || !groupName) {
      alert("Please select files and enter required fields.");
      return;
    }

    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    formData.append("unique_key", uniqueKey);
    formData.append("group_name", groupName);

    try {
      const response = await Axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(response.data.message);
      setFiles([]);
      setUniqueKey("");
      setGroupName("");

      document.querySelector(".uploadFile").value = "";
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading files.");
    }
  };

  return (
    <div className="rightRow">
      <input
        type="file"
        multiple
        className="uploadFile"
        onChange={handleFileChange}
        required
      />
      <input
        type="text"
        className="textInput"
        placeholder="Enter a key"
        value={uniqueKey}
        onChange={(e) => setUniqueKey(e.target.value)}
        required
      />
      <input
        type="text"
        className="textInput"
        placeholder="Enter a group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        required
      />
      <button className="submit-btn" onClick={uploadFiles}>
        UPLOAD
      </button>
    </div>
  );
}
