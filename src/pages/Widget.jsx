import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
import "../styles/Widget.css";
import Loading from "../components/Loading";

const Widget = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e) => {
    // const username = process.env.USERNAME;
    // const password = process.env.PASSWORD;
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "https://seo-audit-646a.onrender.com/api/audit_url",
        {
          url,
        }
      );
      const track_id = res.data.id;
      if (res.data.success) {
        // setResult(res.data);
        try {
          const audit_response = await axios.get(
            `https://api.dataforseo.com/v3/on_page/summary/${track_id}`,
            {
              auth: {
                username: "jainakshat423@gmail.com",
                password: "f507ef0e4a3d29ef",
              },
            }
          );
          const res_message = audit_response.data.tasks[0].status_message;
          setStatusMessage(res_message);
          setResult(audit_response.data);
          setLoading(false);
        } catch (error) {
          message.error(error);
        }
      } else {
        message.error("Failed to Audit");
      }
    } catch (error) {
      console.log(error);
      message.error(error);
    }
    setUrl("");
  };

  return (
    <div className="widget-container">
      <h1 className="widget-title">URL SEO Audit</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="widget-input"
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button className="widget-button" type="submit">
          Check
        </button>
      </form>

      {loading && (
        <p className="widget-loading">
          <Loading />
        </p>
      )}

      {result && !loading && (
        <div className="widget-result">
          <h1>Status : {statusMessage}</h1>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Widget;
