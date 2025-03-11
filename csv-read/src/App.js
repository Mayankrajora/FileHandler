import { useState } from "react";
import "./App.css";
import UploadForm from "./components/Forms/UploadForm";
import GetData from "./components/ShowData/GetData";

function App() {
  const [showGetData, setShowGetData] = useState(false);

  const toggleView = (view) => {
    setShowGetData(view === "getData");
  };

  return (
    <div className="container">
      <div className="webpage">
        <h2>CSV Handler</h2>
        <div className="pageRow">
          {/* Left Side - Buttons */}
          <div className="leftRow">
            <button className="upload-btn" onClick={() => toggleView("upload")}>
              Upload Files
            </button>
            <button className="get-btn" onClick={() => toggleView("getData")}>
              Get Files
            </button>
          </div>

          {/* Right Side - UploadForm or GetData */}
          <div className="rightRow">
            {showGetData ? <GetData /> : <UploadForm />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
