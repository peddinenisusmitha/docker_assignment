
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API = "http://localhost:9000/printing";

function App() {
  const [prints, setPrints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [form, setForm] = useState({
    serviceName: "",
    paperType: "",
    pricePerPage: "",
    colorPrinting: "true",
  });

  const [errors, setErrors] = useState({});

  async function loadPrints() {
    setLoading(true);

    try {
      const response = await fetch(`${API}/displayall`);

      if (!response.ok) {
        throw new Error("Unable to load printing services.");
      }

      const data = await response.json();
      setPrints(Array.isArray(data) ? data : []);
    } catch {
      setMessage("Cannot connect to the backend. Check Spring Boot and CORS.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPrints();
  }, []);

  function updateField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));

    if (errors[field]) {
      setErrors((previous) => ({ ...previous, [field]: "" }));
    }
  }

  function validate() {
    const nextErrors = {};
    const price = Number(form.pricePerPage);

    if (!form.serviceName.trim()) {
      nextErrors.serviceName = "Service name is required.";
    } else if (form.serviceName.trim().length > 100) {
      nextErrors.serviceName = "Maximum 100 characters allowed.";
    }

    if (!form.paperType.trim()) {
      nextErrors.paperType = "Paper type is required.";
    } else if (form.paperType.trim().length > 50) {
      nextErrors.paperType = "Maximum 50 characters allowed.";
    }

    if (
      form.pricePerPage.trim() === "" ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      nextErrors.pricePerPage = "Enter a price greater than zero.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function addPrint(event) {
    event.preventDefault();
    setMessage("");

    if (!validate()) return;

    setSaving(true);

    try {
      const response = await fetch(`${API}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceName: form.serviceName.trim(),
          paperType: form.paperType.trim(),
          pricePerPage: Number(form.pricePerPage),
          colorPrinting: form.colorPrinting === "true",
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        const validationMessage =
          result.errors?.map((error) => error.defaultMessage).filter(Boolean).join(" ") ||
          result.message ||
          "Unable to add printing service. Check your input.";

        throw new Error(validationMessage);
      }

      setForm({
        serviceName: "",
        paperType: "",
        pricePerPage: "",
        colorPrinting: "true",
      });

      setErrors({});
      setMessage("Printing service added successfully!");
      setMessageType("success");

      await loadPrints();
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  async function deletePrint(id) {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    setDeletingId(id);
    setMessage("");

    try {
      const response = await fetch(`${API}/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete this service.");
      }

      setPrints((previous) => previous.filter((print) => print.id !== id));
      setMessage("Printing service deleted successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message || "Delete failed.");
      setMessageType("error");
    } finally {
      setDeletingId(null);
    }
  }

  const colorCount = prints.filter((print) => print.colorPrinting).length;
  const paperTypes = new Set(
    prints.map((print) => print.paperType).filter(Boolean)
  ).size;

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand navbar-dark app-navbar">
        <div className="container-fluid dashboard-container">
          <a className="navbar-brand brand" href="#home">
            <span className="brand-icon">▤</span>
            <span>
              PrintEase
              <small>PRINTING MANAGEMENT</small>
            </span>
          </a>

          <div className="nav-links">
            <a href="#add" className="nav-link-custom">
              <span>＋</span> Add Service
            </a>
            <a href="#services" className="nav-link-custom active">
              View Services
            </a>
          </div>
        </div>
      </nav>

      <main className="container dashboard-container py-4" id="home">
        <section className="welcome-banner">
          <div className="welcome-content">
            <span className="eyebrow">PRINT MANAGEMENT DASHBOARD</span>
            <h1>Manage your printing services</h1>
            <p>
              Add, view and manage all your printing options in one place.
            </p>
          </div>
          <div className="welcome-icon" aria-hidden="true">▤</div>
        </section>

        {message && (
          <div
            className={`feedback-message ${
              messageType === "error" ? "feedback-error" : "feedback-success"
            }`}
            role="status"
          >
            <span>{messageType === "error" ? "!" : "✓"}</span>
            <div>{message}</div>
            <button
              type="button"
              className="feedback-close"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <section className="row g-3 summary-row">
          <div className="col-12 col-sm-4">
            <div className="summary-card">
              <div className="summary-icon blue-icon">▤</div>
              <div>
                <p>Total services</p>
                <h2>{prints.length}</h2>
                <span>Registered printing options</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="summary-card">
              <div className="summary-icon teal-icon">◉</div>
              <div>
                <p>Color printing</p>
                <h2>{colorCount}</h2>
                <span>Services with color available</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="summary-card">
              <div className="summary-icon purple-icon">▧</div>
              <div>
                <p>Paper types</p>
                <h2>{paperTypes}</h2>
                <span>Different paper formats</span>
              </div>
            </div>
          </div>
        </section>

        <section className="row g-4 content-row">
          <div className="col-12 col-lg-4" id="add">
            <div className="panel-card form-panel">
              <div className="panel-heading">
                <div>
                  <span className="section-kicker">NEW ENTRY</span>
                  <h2>Add a printing service</h2>
                  <p>Fill in the service details below.</p>
                </div>
                <span className="heading-icon">＋</span>
              </div>

              <form onSubmit={addPrint} noValidate>
                <div className="field-group">
                  <label htmlFor="serviceName">Service name</label>
                  <input
                    id="serviceName"
                    className={`form-control ${
                      errors.serviceName ? "is-invalid" : ""
                    }`}
                    placeholder="e.g. Digital Printing"
                    maxLength={100}
                    value={form.serviceName}
                    onChange={(e) => updateField("serviceName", e.target.value)}
                    aria-describedby="serviceNameError"
                  />
                  {errors.serviceName && (
                    <div id="serviceNameError" className="invalid-feedback">
                      {errors.serviceName}
                    </div>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor="paperType">Paper type</label>
                  <input
                    id="paperType"
                    className={`form-control ${
                      errors.paperType ? "is-invalid" : ""
                    }`}
                    placeholder="e.g. A4, A3, Letter"
                    maxLength={50}
                    value={form.paperType}
                    onChange={(e) => updateField("paperType", e.target.value)}
                    aria-describedby="paperTypeError"
                  />
                  {errors.paperType && (
                    <div id="paperTypeError" className="invalid-feedback">
                      {errors.paperType}
                    </div>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor="pricePerPage">Price per page (₹)</label>
                  <div className="price-input-wrap">
                    <span>₹</span>
                    <input
                      id="pricePerPage"
                      type="number"
                      min="0.01"
                      step="0.01"
                      className={`form-control ${
                        errors.pricePerPage ? "is-invalid" : ""
                      }`}
                      placeholder="0.00"
                      value={form.pricePerPage}
                      onChange={(e) =>
                        updateField("pricePerPage", e.target.value)
                      }
                      aria-describedby="pricePerPageError"
                    />
                  </div>
                  {errors.pricePerPage && (
                    <div id="pricePerPageError" className="field-error">
                      {errors.pricePerPage}
                    </div>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor="colorPrinting">Color printing</label>
                  <select
                    id="colorPrinting"
                    className="form-select"
                    value={form.colorPrinting}
                    onChange={(e) =>
                      updateField("colorPrinting", e.target.value)
                    }
                  >
                    <option value="true">Available</option>
                    <option value="false">Not available</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-add-service"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Adding service...
                    </>
                  ) : (
                    <>＋ &nbsp; Add Service</>
                  )}
                </button>

                <p className="form-note">
                  The service ID is generated automatically.
                </p>
              </form>
            </div>
          </div>

          <div className="col-12 col-lg-8" id="services">
            <div className="panel-card services-panel">
              <div className="panel-heading services-heading">
                <div>
                  <span className="section-kicker">YOUR INVENTORY</span>
                  <h2>Printing services</h2>
                  <p>View and manage your registered services.</p>
                </div>

                <button
                  type="button"
                  className="btn btn-refresh"
                  onClick={loadPrints}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    "↻"
                  )}
                  <span className="ms-2">Refresh</span>
                </button>
              </div>

              {loading && prints.length === 0 ? (
                <div className="empty-state">
                  <span className="spinner-border text-primary" />
                  <p>Loading your printing services...</p>
                </div>
              ) : prints.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">▤</div>
                  <h3>No services yet</h3>
                  <p>Add your first printing service using the form.</p>
                  <a href="#add" className="btn btn-add-service empty-button">
                    ＋ Add your first service
                  </a>
                </div>
              ) : (
                <div className="table-responsive service-table-wrap">
                  <table className="table service-table align-middle">
                    <thead>
                      <tr>
                        <th>Service details</th>
                        <th>Paper</th>
                        <th>Price / page</th>
                        <th>Color</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prints.map((print) => (
                        <tr key={print.id}>
                          <td>
                            <div className="service-name-cell">
                              <span className="table-printer-icon">▤</span>
                              <span>{print.serviceName}</span>
                            </div>
                          </td>
                          <td>
                            <span className="paper-badge">{print.paperType}</span>
                          </td>
                          <td className="price-cell">
                            ₹{Number(print.pricePerPage).toFixed(2)}
                          </td>
                          <td>
                            <span
                              className={`status-badge ${
                                print.colorPrinting ? "status-yes" : "status-no"
                              }`}
                            >
                              <span>●</span>
                              {print.colorPrinting ? "Available" : "B&W only"}
                            </span>
                          </td>
                          <td className="text-end">
                            <button
                              type="button"
                              className="btn btn-delete"
                              onClick={() => deletePrint(print.id)}
                              disabled={deletingId === print.id}
                              aria-label={`Delete ${print.serviceName}`}
                            >
                              {deletingId === print.id
                                ? "Deleting..."
                                : "⌫ Delete"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="table-footer">
                <span>
                  Showing <strong>{prints.length}</strong>{" "}
                  {prints.length === 1 ? "service" : "services"}
                </span>
                <span className="footer-live">
                  <span /> Live database records
                </span>
              </div>
            </div>
          </div>
        </section>

        <footer className="dashboard-footer">
          <span>PrintEase · Printing Service Management</span>
          <span>Powered by Spring Boot &amp; React</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
