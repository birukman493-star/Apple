
import React, { useState, useEffect, useCallback } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiArchive,
  FiBox,
  FiAlertTriangle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

// ======================================================
// API CONFIGURATION
// ======================================================

const API_URL = "http://localhost:5000/api";

const categories = [
  "iPhone",
  "Mac",
  "iPad",
  "Watch",
  "Vision",
  "AirPods",
  "TV & Home",
  "Accessories",
];

// ======================================================
// DATABASE <-> FRONTEND MAPPING
// ======================================================

function parseList(value) {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // The database may store a comma-separated string.
    }

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function fromDatabase(row) {
  return {
    ...row,
    id: String(row.id ?? row.product_id ?? ""),
    name: row.name ?? row.title ?? "",
    category: row.category ?? "iPhone",
    description: row.description ?? "",
    price: row.price ?? row.price_upfront ?? 0,
    discountPrice: row.discountPrice ?? row.discount_price ?? "",
    imageMain: row.imageMain ?? row.image_url ?? "",
    imageGallery: parseList(row.imageGallery ?? row.image_gallery),
    stock: Number(row.stock ?? 0),
    colors: parseList(row.colors),
    storage: parseList(row.storage),
    status:
      row.status ??
      (row.is_active === false || Number(row.is_active) === 0
        ? "Archived"
        : "Published"),
    navVisibility: Boolean(
      row.navVisibility ?? row.nav_visibility ?? true
    ),
  };
}

function toDatabase(product) {
  const colors = parseList(product.colors);
  const storage = parseList(product.storage);
  const imageGallery = parseList(product.imageGallery);

  const price = Number(product.price);
  const discountPrice =
    product.discountPrice === "" ||
    product.discountPrice == null
      ? null
      : Number(product.discountPrice);

  return {
    name: product.name.trim(),
    title: product.name.trim(),
    category: product.category,
    description: product.description || null,

    price,
    price_upfront: price,

    discountPrice,
    discount_price: discountPrice,

    stock: Number(product.stock),
    colors,
    storage,

    imageMain: (product.imageMain || "").trim(),
    image_url: (product.imageMain || "").trim(),
    imageGallery,

    status: product.status,
    is_active: product.status === "Published",
    navVisibility: Boolean(product.navVisibility),
    nav_visibility: Boolean(product.navVisibility),
  };
}

// ======================================================
// API REQUEST HELPER
// Fixes:
// 1. Always calls Express at localhost:5000.
// 2. Attaches the admin JWT when available.
// 3. Sends JSON headers.
// 4. Reads the response body only once.
// 5. Gives useful errors for HTML, 401 and other failures.
// ======================================================

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("adminToken");

  // Accept either "/products" or a full URL.
  const url = /^https?:\/\//i.test(endpoint)
    ? endpoint
    : `${API_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers = {
    Accept: "application/json",
    ...(options.body !== undefined
      ? { "Content-Type": "application/json" }
      : {}),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
      
    });
  } catch (error) {
    throw new Error(
      `Cannot connect to the backend at ${API_URL}. ` +
        "Make sure your Express server is running on port 5000."
    );
  }

  // Read the response only once.
  const responseText = await response.text();

  let data = null;

  if (responseText.trim()) {
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("Expected JSON from API:", {
        url,
        status: response.status,
        response: responseText.slice(0, 300),
      });

      if (response.status === 401) {
        throw new Error(
          "Your admin session has expired. Sign in as admin again."
        );
      }

      if (response.status === 403) {
        throw new Error(
          "Access denied. Check your admin account and permissions."
        );
      }

      throw new Error(
        `The API returned HTML or invalid JSON (HTTP ${response.status}). ` +
          `Check that ${url} is an Express API route, not a frontend page.`
      );
    }
  }

  if (response.status === 401) {
    throw new Error(
      data?.message ||
        "Authentication required. Please sign in as admin."
    );
  }

  if (response.status === 403) {
    throw new Error(
      data?.message ||
        "Admin access denied. Check your admin token and role."
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed with HTTP ${response.status}.`
    );
  }

  return data;
};

// ======================================================
// PRODUCTS COMPONENT
// ======================================================

export default function Products({
  products = [],
  setProducts,
  categoryFilter,
  setCategoryFilter,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const initialFormState = {
    name: "",
    category:
      categoryFilter && categoryFilter !== "All"
        ? categoryFilter
        : "iPhone",
    description: "",
    price: "",
    discountPrice: "",
    imageMain: "",
    imageGallery: "",
    stock: 50,
    colors: "Space Gray, Silver",
    storage: "128GB, 256GB, 512GB",
    status: "Published",
    navVisibility: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  // ======================================================
  // LOAD PRODUCTS
  // ======================================================

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const query = new URLSearchParams();

      if (categoryFilter && categoryFilter !== "All") {
        query.set("category", categoryFilter);
      }

      const suffix = query.toString() ? `?${query.toString()}` : "";
      const result = await apiRequest(`/products${suffix}`);

      const rows = Array.isArray(result)
        ? result
        : Array.isArray(result?.products)
          ? result.products
          : Array.isArray(result?.data)
            ? result.data
            : null;

      if (!rows) {
        throw new Error(
          "The products API did not return an array. Check the GET /api/products response."
        );
      }

      if (typeof setProducts === "function") {
        setProducts(rows.map(fromDatabase));
      }
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, setProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ======================================================
  // OPEN ADD / EDIT MODAL
  // ======================================================

  const handleOpenAddModal = () => {
    setEditingProduct(null);

    setFormData({
      ...initialFormState,
      category:
        categoryFilter && categoryFilter !== "All"
          ? categoryFilter
          : "iPhone",
    });

    setError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);

    setFormData({
      ...initialFormState,
      ...product,
      price: product.price ?? "",
      discountPrice: product.discountPrice ?? "",
      imageGallery: Array.isArray(product.imageGallery)
        ? product.imageGallery.join(", ")
        : product.imageGallery || "",
      colors: Array.isArray(product.colors)
        ? product.colors.join(", ")
        : product.colors || "",
      storage: Array.isArray(product.storage)
        ? product.storage.join(", ")
        : product.storage || "",
    });

    setError("");
    setIsModalOpen(true);
  };

  // ======================================================
  // SAVE PRODUCT
  // ======================================================

  const handleSaveProduct = async (event) => {
    event.preventDefault();

    if (saving) return;

    const price = Number(formData.price);
    const stock = Number(formData.stock);

    const discount =
      formData.discountPrice === "" ||
      formData.discountPrice == null
        ? null
        : Number(formData.discountPrice);

    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (
      formData.price === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setError("Enter a valid, non-negative product price.");
      return;
    }

    if (
      formData.stock === "" ||
      !Number.isFinite(stock) ||
      stock < 0 ||
      !Number.isInteger(stock)
    ) {
      setError("Enter a valid, non-negative whole-number stock quantity.");
      return;
    }

    if (
      discount !== null &&
      (!Number.isFinite(discount) || discount < 0)
    ) {
      setError("Enter a valid discount price.");
      return;
    }

    if (discount !== null && discount > price) {
      setError(
        "The discount price should not exceed the regular price."
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = toDatabase({
        ...formData,
        price,
        stock,
        discountPrice: discount ?? "",
      });

      if (editingProduct) {
        await apiRequest(
          `/products/${encodeURIComponent(editingProduct.id)}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
      } else {
        await apiRequest("/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      await loadProducts();

      setIsModalOpen(false);
      setEditingProduct(null);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message || "Failed to save the product.");
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // ARCHIVE PRODUCT
  // ======================================================

  const handleArchive = async (id) => {
    const confirmed = window.confirm(
      "Archive this product? It should no longer appear in the public store."
    );

    if (!confirmed) return;

    setError("");

    try {
      await apiRequest(`/products/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify({
          status: "Archived",
          is_active: false,
          navVisibility: false,
          nav_visibility: false,
        }),
      });

      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to archive product.");
    }
  };

  // ======================================================
  // DELETE PRODUCT
  // ======================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product? Products connected to order history should ideally be archived instead."
    );

    if (!confirmed) return;

    setError("");

    try {
      await apiRequest(`/products/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to delete product.");
    }
  };

  // ======================================================
  // FILTER, SEARCH AND SORT
  // ======================================================

  const filteredProducts = products
    .map(fromDatabase)
    .filter((product) => {
      const name = String(product.name ?? "").toLowerCase();
      const id = String(product.id ?? "").toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        name.includes(search) || id.includes(search);

      const matchesCategory =
        !categoryFilter ||
        categoryFilter === "All" ||
        product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        product.status === statusFilter;

      let matchesStock = true;

      if (stockFilter === "low") {
        matchesStock =
          Number(product.stock) > 0 &&
          Number(product.stock) <= 10;
      }

      if (stockFilter === "out") {
        matchesStock = Number(product.stock) === 0;
      }

      if (stockFilter === "in") {
        matchesStock = Number(product.stock) > 10;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesStock
      );
    })
    .sort((a, b) => {
      if (sortBy === "price-low") {
        return Number(a.price) - Number(b.price);
      }

      if (sortBy === "price-high") {
        return Number(b.price) - Number(a.price);
      }

      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "stock") {
        return Number(b.stock) - Number(a.stock);
      }

      return String(b.id).localeCompare(String(a.id), undefined, {
        numeric: true,
      });
    });

  // ======================================================
  // PAGINATION
  // ======================================================

  const totalPages =
    Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = filteredProducts.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  // ======================================================
  // REUSABLE FORM FIELD UPDATE
  // ======================================================

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="content-view">
      <div
        className="view-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1>
            Product Management{" "}
            {categoryFilter && categoryFilter !== "All"
              ? `— ${categoryFilter}`
              : ""}
          </h1>

          <p>
            Add products, update prices, manage variants, track stock,
            and control website publication.
          </p>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={handleOpenAddModal}
        >
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <span>{error}</span>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="secondary-btn"
              onClick={loadProducts}
              disabled={loading}
            >
              Retry
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => setError("")}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="table-container">
        {/* TOOLBAR */}
        <div
          className="table-toolbar"
          style={{ flexWrap: "wrap", gap: "12px" }}
        >
          <div
            className="filter-group"
            style={{ flexWrap: "wrap", gap: "10px" }}
          >
            <div
              className="search-container"
              style={{ width: "240px", maxWidth: "100%" }}
            >
              <FiSearch size={16} />

              <input
                type="text"
                placeholder="Search name or ID..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(event.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>

            <select
              className="filter-select"
              value={stockFilter}
              onChange={(event) => {
                setStockFilter(event.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Inventory</option>
              <option value="in">In Stock (&gt;10)</option>
              <option value="low">Low Stock (1-10)</option>
              <option value="out">Out of Stock (0)</option>
            </select>

            <select
              className="filter-select"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="newest">Sort: Newest</option>
              <option value="name">Sort: Name</option>
              <option value="price-low">Sort: Price (Low to High)</option>
              <option value="price-high">Sort: Price (High to Low)</option>
              <option value="stock">Sort: Stock Quantity</option>
            </select>
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "#64748b",
              fontWeight: 600,
            }}
          >
            {loading
              ? "Loading products..."
              : `Showing ${filteredProducts.length} products`}
          </div>
        </div>

        {/* PRODUCT TABLE */}
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name &amp; Category</th>
                <th>Price &amp; Discount</th>
                <th>Variants</th>
                <th>Stock Inventory</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "32px",
                      color: "#64748b",
                    }}
                  >
                    Loading products from database...
                  </td>
                </tr>
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <tr key={product.id}>
                    <td
                      style={{
                        fontWeight: 700,
                        color: "#3b82f6",
                        fontSize: "12px",
                      }}
                    >
                      {product.id}
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "10px",
                            background: "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            border: "1px solid #e2e8f0",
                            flexShrink: 0,
                          }}
                        >
                          {product.imageMain ? (
                            <img
                              src={product.imageMain}
                              alt={product.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <FiBox
                              size={20}
                              style={{ color: "#94a3b8" }}
                            />
                          )}
                        </div>

                        <div>
                          <div
                            style={{
                              fontWeight: 700,
                              color: "#0f172a",
                            }}
                          >
                            {product.name}
                          </div>

                          <div
                            style={{
                              fontSize: "11px",
                              color: "#64748b",
                            }}
                          >
                            {product.category}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700 }}>
                        ${Number(product.price).toLocaleString()}
                      </div>

                      {product.discountPrice !== "" &&
                        product.discountPrice != null && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#16a34a",
                              fontWeight: 600,
                            }}
                          >
                            Discount: $
                            {Number(
                              product.discountPrice
                            ).toLocaleString()}
                          </div>
                        )}
                    </td>

                    <td
                      style={{
                        fontSize: "12px",
                        color: "#475569",
                      }}
                    >
                      <div>
                        <strong>Colors:</strong>{" "}
                        {Array.isArray(product.colors)
                          ? product.colors.join(", ")
                          : product.colors || "N/A"}
                      </div>

                      <div>
                        <strong>Storage:</strong>{" "}
                        {Array.isArray(product.storage)
                          ? product.storage.join(", ")
                          : product.storage || "N/A"}
                      </div>
                    </td>

                    <td>
                      {Number(product.stock) === 0 ? (
                        <span
                          className="badge-pill"
                          style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FiAlertTriangle size={12} />
                          Out of Stock
                        </span>
                      ) : Number(product.stock) <= 10 ? (
                        <span
                          className="badge-pill warning"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <FiAlertTriangle size={12} />
                          Low Stock ({product.stock})
                        </span>
                      ) : (
                        <span
                          style={{
                            fontWeight: 600,
                            color: "#334155",
                          }}
                        >
                          {product.stock} units
                        </span>
                      )}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${String(
                          product.status || "Draft"
                        ).toLowerCase()}`}
                      >
                        {product.status || "Draft"}
                      </span>
                    </td>

                    <td
                      style={{
                        textAlign: "right",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <button
                        type="button"
                        className="icon-btn"
                        style={{
                          display: "inline-flex",
                          marginRight: "6px",
                        }}
                        onClick={() => handleOpenEditModal(product)}
                        title="Edit Product"
                        aria-label={`Edit ${product.name}`}
                      >
                        <FiEdit2 size={14} />
                      </button>

                      {product.status !== "Archived" && (
                        <button
                          type="button"
                          className="icon-btn"
                          style={{
                            display: "inline-flex",
                            marginRight: "6px",
                            color: "#d97706",
                          }}
                          onClick={() => handleArchive(product.id)}
                          title="Archive Product"
                          aria-label={`Archive ${product.name}`}
                        >
                          <FiArchive size={14} />
                        </button>
                      )}

                      <button
                        type="button"
                        className="icon-btn"
                        style={{
                          display: "inline-flex",
                          color: "#ef4444",
                        }}
                        onClick={() => handleDelete(product.id)}
                        title="Delete Product"
                        aria-label={`Delete ${product.name}`}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "32px",
                      color: "#64748b",
                    }}
                  >
                    No products found matching your active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div
          className="table-toolbar"
          style={{
            justifyContent: "space-between",
            borderTop: "1px solid #e2e8f0",
            borderBottom: "none",
          }}
        >
          <div style={{ fontSize: "13px", color: "#64748b" }}>
            Page {safeCurrentPage} of {totalPages}
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="secondary-btn"
              disabled={safeCurrentPage === 1 || loading}
              onClick={() =>
                setCurrentPage((page) => Math.max(page - 1, 1))
              }
              style={{
                opacity: safeCurrentPage === 1 ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <FiChevronLeft size={14} /> Previous
            </button>

            <button
              type="button"
              className="secondary-btn"
              disabled={safeCurrentPage === totalPages || loading}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(page + 1, totalPages)
                )
              }
              style={{
                opacity: safeCurrentPage === totalPages ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Next <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div
            className="modal-content"
            style={{
              width: "650px",
              maxWidth: "95vw",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div className="modal-header">
              <h3>
                {editingProduct
                  ? `Edit Product (${editingProduct.id})`
                  : "Add New Apple Product"}
              </h3>

              <button
                type="button"
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="modal-body">
                {/* NAME AND CATEGORY */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
                  }}
                >
                  <div className="form-group">
                    <label>Product Name</label>

                    <input
                      type="text"
                      required
                      placeholder="e.g., iPhone 17 Pro Max"
                      value={formData.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>

                    <select
                      required
                      value={formData.category}
                      onChange={(event) =>
                        updateField("category", event.target.value)
                      }
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="form-group">
                  <label>Description</label>

                  <textarea
                    placeholder="Describe key features, specs, and design details..."
                    value={formData.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                  />
                </div>

                {/* PRICE AND STOCK */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "16px",
                  }}
                >
                  <div className="form-group">
                    <label>Price ($ USD)</label>

                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      placeholder="999"
                      value={formData.price}
                      onChange={(event) =>
                        updateField("price", event.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Optional Discount Price ($)</label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="899"
                      value={formData.discountPrice}
                      onChange={(event) =>
                        updateField("discountPrice", event.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock Inventory</label>

                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      placeholder="50"
                      value={formData.stock}
                      onChange={(event) =>
                        updateField("stock", event.target.value)
                      }
                    />
                  </div>
                </div>

                {/* COLORS AND STORAGE */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
                  }}
                >
                  <div className="form-group">
                    <label>Color Options (comma-separated)</label>

                    <input
                      type="text"
                      placeholder="Natural Titanium, Black, White"
                      value={formData.colors}
                      onChange={(event) =>
                        updateField("colors", event.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Storage Capacities (comma-separated)</label>

                    <input
                      type="text"
                      placeholder="256GB, 512GB, 1TB"
                      value={formData.storage}
                      onChange={(event) =>
                        updateField("storage", event.target.value)
                      }
                    />
                  </div>
                </div>

                {/* IMAGES */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
                  }}
                >
                  <div className="form-group">
                    <label>Main Image URL</label>

                    <input
                      type="text"
                      placeholder="https://example.com/product.jpg"
                      value={formData.imageMain}
                      onChange={(event) =>
                        updateField("imageMain", event.target.value)
                      }
                    />

                    <label style={{ marginTop: "10px" }}>
                      Or select an image from your PC
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (!file) return;

                        if (!file.type.startsWith("image/")) {
                          setError("Please select an image file.");
                          event.target.value = "";
                          return;
                        }

                        if (file.size > 5 * 1024 * 1024) {
                          setError(
                            "Please choose an image smaller than 5 MB."
                          );
                          event.target.value = "";
                          return;
                        }

                        const reader = new FileReader();

                        reader.onload = () => {
                          updateField(
                            "imageMain",
                            String(reader.result)
                          );
                        };

                        reader.onerror = () => {
                          setError("Could not read the selected image.");
                        };

                        reader.readAsDataURL(file);
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Image Gallery (comma-separated URLs)</label>

                    <input
                      type="text"
                      placeholder="image1.jpg, image2.jpg"
                      value={formData.imageGallery}
                      onChange={(event) =>
                        updateField("imageGallery", event.target.value)
                      }
                    />
                  </div>
                </div>

                {/* STATUS */}
                <div className="form-group">
                  <label>Status</label>

                  <select
                    value={formData.status}
                    onChange={(event) => {
                      const status = event.target.value;

                      setFormData((previous) => ({
                        ...previous,
                        status,
                        navVisibility:
                          status === "Published"
                            ? previous.navVisibility
                            : false,
                      }));
                    }}
                  >
                    <option value="Published">
                      Published (Visible in store)
                    </option>
                    <option value="Draft">Draft (Hidden)</option>
                    <option value="Archived">
                      Archived (Retained for history)
                    </option>
                  </select>
                </div>

                {/* NAVIGATION VISIBILITY */}
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="navVisCheck"
                    checked={formData.navVisibility}
                    onChange={(event) =>
                      updateField(
                        "navVisibility",
                        event.target.checked
                      )
                    }
                  />

                  <label
                    htmlFor="navVisCheck"
                    style={{ cursor: "pointer" }}
                  >
                    Show product in public navigation dropdown menu
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-btn"
                  disabled={saving}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                      ? "Update Product"
                      : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
