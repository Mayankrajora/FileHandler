import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./GetData.css";

export default function GetData() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await Axios.get("http://localhost:5000/get-files");
      if (response.data && response.data.result) {
        setData(response.data.result);
      }
      setLoading(false);
    } catch (err) {
      setError("Error fetching files. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="right-content">
      <h3>Uploaded Files</h3>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="file-grid">
          {Object.entries(data).map(([groupname, filenames]) => (
            <div key={groupname} className="group-card">
              <h4>{groupname}</h4>
              <ul>
                {filenames.map((filename, index) => (
                  <li key={index} className="file-item">
                    📄 {filename}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
