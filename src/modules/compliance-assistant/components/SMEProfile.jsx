import { useState } from "react";
import { useNavigate } from "react-router-dom";

// SME profile form collected before the assessment questions.
const SMEProfilePage = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    organizationName: "",
    sector: "",
    size: "",
    dataType: "",
  });

  // Update profile state from form inputs.
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Validate required fields, store to localStorage, then start Stage 1.
  const handleSubmit = () => {
    const orgName = String(profile.organizationName || "").trim();
    const sector = String(profile.sector || "").trim();
    const size = String(profile.size || "").trim();
    const dataType = String(profile.dataType || "").trim();

    const missing = [];
    if (!orgName) missing.push("organization name");
    if (!sector) missing.push("organization sector");
    if (!size) missing.push("number of employees");
    if (!dataType) missing.push("primary type of data handled");

    if (missing.length) {
      window.alert(`Please complete: ${missing.join(", ")}.`);
      return;
    }

    localStorage.setItem(
      "profile",
      JSON.stringify({
        ...profile,
        organizationName: orgName,
        sector,
        size,
        dataType,
      })
    );
    navigate("/dashboard/compliance-assistant/assessment/mandatory");
  };

  const selectStyle = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: "14px",
    border: "1px solid var(--color-border)",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "var(--color-text-primary)",
    backgroundColor: "var(--color-bg-cream-light)",
    cursor: "pointer",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    outline: "none",
  };

  const textInputStyle = {
    ...selectStyle,
    cursor: "text",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    color: "var(--color-text-primary)",
    fontSize: "15px",
    fontWeight: 700,
  };

  const helperStyle = { fontSize: "13px", color: "var(--color-text-muted)", marginTop: "6px" };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(28px, 4vw, 40px)",
            letterSpacing: "-0.025em",
            marginBottom: "12px",
            color: "var(--color-text-primary)",
          }}
        >
          About Your Organization
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "16px", lineHeight: 1.65 }}>
          Help us understand your organization better so we can give you the most relevant recommendations.
        </p>
      </div>

      {/* FORM CONTAINER */}
      <div
        className="glass-card"
        style={{ padding: "40px" }}
      >
        {/* Organization Sector */}
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Name of the Organization</label>
          <input
            type="text"
            name="organizationName"
            value={profile.organizationName}
            onChange={handleChange}
            placeholder="Enter organization name"
            required
            style={textInputStyle}
          />
          <p style={helperStyle}>
            This will appear in your assessment profile.
          </p>
        </div>

        {/* Organization Sector */}
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Organization sector</label>
          <select
            name="sector"
            value={profile.sector}
            onChange={handleChange}
            required
            style={selectStyle}
          >
            <option value="">Select your sector</option>
            <option>Banking / Finance / Insurance</option>
            <option>IT / Software Development</option>
            <option>Healthcare</option>
            <option>Education</option>
            <option>Manufacturing</option>
            <option>Retail / E-commerce</option>
            <option>Other</option>
          </select>
          <p style={helperStyle}>
            This helps us contextualize the controls relevant to your industry.
          </p>
        </div>

        {/* Organization Size */}
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Number of employees</label>
          <select
            name="size"
            value={profile.size}
            onChange={handleChange}
            required
            style={selectStyle}
          >
            <option value="">Select organization size</option>
            <option>1–10</option>
            <option>11–50</option>
            <option>51–100</option>
            <option>101–250</option>
          </select>
          <p style={helperStyle}>
            Helps us understand your resource constraints.
          </p>
        </div>

        {/* Data Type */}
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Primary type of data handled</label>
          <select
            name="dataType"
            value={profile.dataType}
            onChange={handleChange}
            required
            style={selectStyle}
          >
            <option value="">Select data type</option>
            <option>General business data</option>
            <option>Personal data</option>
            <option>Financial data</option>
            <option>Sensitive personal data</option>
          </select>
          <p style={helperStyle}>
            Important for assessing your security requirements.
          </p>
        </div>

        <div style={{ marginBottom: "32px" }} />

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => navigate("/dashboard/compliance-assistant")}
            className="btn-ghost"
            style={{ fontSize: "14px", padding: "12px 24px" }}
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
            style={{ fontSize: "14px", padding: "12px 28px" }}
          >
            Save and start assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SMEProfilePage;
