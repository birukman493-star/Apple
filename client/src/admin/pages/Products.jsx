import React, { useState, useEffect, useCallback, useMemo } from "react";
import placeholder from "../../constants/placeholder";
import "./Products.css";
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
  FiCheckCircle,
  FiEye,
  FiUploadCloud,
  FiRefreshCw,
  FiDollarSign,
  FiTag,
  FiLayers,
  FiFilter,
  FiX,
  FiImage,
  FiSettings,
  FiSliders,
  FiArrowRight,
  FiPercent
} from "react-icons/fi";

const API_URL = "http://localhost:5000/api";
const categories = [
  "iPhone",
  "Mac",
  "iPad",
  "Watch",
  "Vision",
  "AirPods",
  "TV & Home",
  "Accessories"
];

// Curated high-resolution Apple official product preset photos
const PRESET_IMAGES = {
  iPhone: [
    { label: "iPhone 16 Pro Desert Titanium", url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80" },
    { label: "iPhone 16 Black", url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80" },
    { label: "iPhone 15 Blue", url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80" }
  ],
  Mac: [
    { label: "MacBook Pro Space Black", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80" },
    { label: "MacBook Air Midnight", url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80" },
    { label: "iMac 24-inch", url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80" }
  ],
  iPad: [
    { label: "iPad Pro M4", url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80" },
    { label: "iPad Air", url: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&auto=format&fit=crop&q=80" }
  ],
  Watch: [
    { label: "Apple Watch Ultra 2", url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80" },
    { label: "Apple Watch Series 10", url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80" }
  ],
  Vision: [
    { label: "Apple Vision Pro", url: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=80" }
  ],
  AirPods: [
    { label: "AirPods Pro 2", url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80" },
    { label: "AirPods Max", url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80" }
  ],
  "TV & Home": [
    { label: "Apple TV 4K", url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80" },
    { label: "HomePod mini", url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80" }
  ],
  Accessories: [
    { label: "MagSafe Charger", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80" },
    { label: "Magic Keyboard", url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80" }
  ]
};

// Available popular Apple color presets
const COLOR_PRESETS = [
  { name: "Natural Titanium", hex: "#9b9893" },
  { name: "Desert Titanium", hex: "#cbb7a0" },
  { name: "Space Black", hex: "#2c2b29" },
  { name: "White Titanium", hex: "#e3e4e5" },
  { name: "Silver", hex: "#e2e4e6" },
  { name: "Midnight", hex: "#1e2022" },
  { name: "Starlight", hex: "#f0eae1" },
  { name: "Deep Blue", hex: "#22384c" },
  { name: "(PRODUCT)RED", hex: "#d81f26" }
];

const STORAGE_PRESETS = ["128GB", "256GB", "512GB", "1TB", "2TB"];

function parseList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Fallback to comma separation
    }
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function fromDatabase(row) {
  const isActive = row.is_active !== undefined ? Boolean(Number(row.is_active)) : true;
  let status = row.status;
  if (!status) {
    status = isActive ? "Published" : "Archived";
  } else if (status === "Active") {
    status = "Published";
  }

  return {
    ...row,
    id: String(row.id ?? row.product_id ?? ""),
    name: row.name ?? row.title ?? "",
    title: row.title ?? row.name ?? "",
    category: row.category ?? "iPhone",
    description: row.description ?? "",
    badge_text: row.badge_text ?? row.badge ?? "",
    price: Number(row.price ?? row.price_upfront ?? 0),
    discountPrice: row.discountPrice ?? row.discount_price ?? "",
    imageMain: row.imageMain ?? row.image_url ?? "",
    imageGallery: parseList(row.imageGallery ?? row.image_gallery),
    stock: Number(row.stock ?? 0),
    colors: parseList(row.colors),
    storage: parseList(row.storage ?? row.storage_options),
    status: status,
    is_active: isActive,
    navVisibility: Boolean(row.navVisibility ?? row.nav_visibility ?? true)
  };
}

function toDatabase(product) {
  const colors = parseList(product.colors);
  const storage = parseList(product.storage);
  const imageGallery = parseList(product.imageGallery);
  const price = Number(product.price);
  const discountPrice =
    product.discountPrice === "" || product.discountPrice == null
      ? null
      : Number(product.discountPrice);

  let status = product.status || "Published";
  if (status === "Published") {
    status = "Active";
  }

  const isActive = status === "Active";

  return {
    name: product.name.trim(),
    title: product.name.trim(),
    category: product.category,
    description: product.description || null,
    badge_text: product.badge_text || null,
    price,
    price_upfront: price,
    discountPrice,
    discount_price: discountPrice,
    stock: Number(product.stock ?? 50),
    colors,
    storage,
    storage_options: storage,
    imageMain: (product.imageMain || "").trim(),
    image_url: (product.imageMain || "").trim(),
    imageGallery,
    image_gallery: imageGallery,
    status: status,
    is_active: isActive,
    navVisibility: Boolean(product.navVisibility ?? true),
    nav_visibility: Boolean(product.navVisibility ?? true)
  };
}

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  const url = /^https?:\/\//i.test(endpoint)
    ? endpoint
    : `${API_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers = {
    Accept: "application/json",
    ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  const responseText = await response.text();
  let data = null;

  if (responseText.trim()) {
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(`The API returned invalid JSON (HTTP ${response.status}).`);
    }
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Request failed with HTTP ${response.status}.`);
  }

  return data;
};

export default function Products({
  products = [],
  setProducts,
  categoryFilter: initialCategoryFilter,
  setCategoryFilter: externalSetCategoryFilter
}) {
  // Filters & State
  const [internalCategoryFilter, setInternalCategoryFilter] = useState("All");
  const activeCategoryFilter =
    initialCategoryFilter !== undefined ? initialCategoryFilter : internalCategoryFilter;

  const handleCategoryFilterChange = (cat) => {
    if (typeof externalSetCategoryFilter === "function") {
      externalSetCategoryFilter(cat);
    } else {
      setInternalCategoryFilter(cat);
    }
    setCurrentPage(1);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("general"); // 'general' | 'pricing' | 'media' | 'variants'
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [successToast, setSuccessToast] = useState("");

  const initialFormState = {
    name: "",
    category:
      activeCategoryFilter && activeCategoryFilter !== "All"
        ? activeCategoryFilter
        : "iPhone",
    description: "",
    badge_text: "",
    price: "",
    discountPrice: "",
    imageMain: "",
    imageGallery: "",
    stock: 50,
    colors: "Space Black, Silver, Natural Titanium",
    storage: "128GB, 256GB, 512GB",
    status: "Published",
    navVisibility: true
  };

  const [formData, setFormData] = useState(initialFormState);

  // Auto-clear success toast
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams();
      query.set("status", "all");
      if (activeCategoryFilter && activeCategoryFilter !== "All") {
        query.set("category", activeCategoryFilter);
      }
      const result = await apiRequest(`/products?${query.toString()}`);

      const rows = Array.isArray(result)
        ? result
        : Array.isArray(result?.products)
        ? result.products
        : Array.isArray(result?.data)
        ? result.data
        : null;

      if (!rows) throw new Error("The products API did not return an array.");

      if (typeof setProducts === "function") {
        setProducts(rows.map(fromDatabase));
      }
    } catch (err) {
      setError(err.message || "Failed to load products from database.");
    } finally {
      setLoading(false);
    }
  }, [activeCategoryFilter, setProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setModalTab("general");
    const cat =
      activeCategoryFilter && activeCategoryFilter !== "All"
        ? activeCategoryFilter
        : "iPhone";
    const defaultPreset = PRESET_IMAGES[cat]?.[0]?.url || "";

    setFormData({
      ...initialFormState,
      category: cat,
      imageMain: defaultPreset
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setModalTab("general");
    setFormData({
      ...initialFormState,
      ...product,
      badge_text: product.badge_text || product.badge || "",
      price: product.price ?? "",
      discountPrice: product.discountPrice ?? "",
      imageMain: product.imageMain ?? product.image_url ?? "",
      imageGallery: Array.isArray(product.imageGallery)
        ? product.imageGallery.join(", ")
        : product.imageGallery || "",
      colors: Array.isArray(product.colors)
        ? product.colors.join(", ")
        : product.colors || "",
      storage: Array.isArray(product.storage)
        ? product.storage.join(", ")
        : product.storage || "",
      status: product.status || "Published"
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleImageFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, WebP, AVIF).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Selected image exceeds the 10MB limit. Please choose a smaller image.");
      return;
    }

    setUploadingImage(true);
    setError("");

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result;
        const result = await apiRequest("/upload", {
          method: "POST",
          body: JSON.stringify({ image: base64Data, filename: file.name })
        });

        if (result?.url) {
          updateField("imageMain", result.url);
          setSuccessToast("Image uploaded and saved successfully!");
        } else {
          updateField("imageMain", base64Data);
        }
      } catch (err) {
        console.warn("Upload fallback notice:", err.message);
        updateField("imageMain", reader.result);
      } finally {
        setUploadingImage(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read image file.");
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = async (event) => {
    event.preventDefault();
    if (saving) return;

    // Client-side validations
    if (!formData.name.trim()) {
      setError("Product Name / Title is required.");
      setModalTab("general");
      return;
    }

    if (!formData.category.trim()) {
      setError("Product Category is required.");
      setModalTab("general");
      return;
    }

    const price = Number(formData.price);
    if (isNaN(price) || price < 0 || formData.price === "") {
      setError("Price must be a valid non-negative number.");
      setModalTab("pricing");
      return;
    }

    const stock = Number(formData.stock);
    if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      setError("Stock inventory must be a non-negative whole integer.");
      setModalTab("pricing");
      return;
    }

    let discount = null;
    if (formData.discountPrice !== "" && formData.discountPrice != null) {
      discount = Number(formData.discountPrice);
      if (isNaN(discount) || discount < 0) {
        setError("Discount price must be a non-negative number.");
        setModalTab("pricing");
        return;
      }
      if (discount >= price) {
        setError("Discount price must be less than the regular price.");
        setModalTab("pricing");
        return;
      }
    }

    // Ensure fallback image if left completely empty
    let image = formData.imageMain.trim();
    if (!image) {
      image = PRESET_IMAGES[formData.category]?.[0]?.url || "";
    }

    setSaving(true);
    setError("");

    try {
      const payload = toDatabase({
        ...formData,
        imageMain: image,
        price,
        stock,
        discountPrice: discount
      });

      let savedProduct;
      if (editingProduct) {
        const response = await apiRequest(`/products/${encodeURIComponent(editingProduct.id)}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        savedProduct = fromDatabase(response.product || response.data || payload);
        if (typeof setProducts === "function") {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? savedProduct : p))
          );
        }
        setSuccessToast(`✓ Updated "${savedProduct.name}" in MySQL database.`);
      } else {
        const response = await apiRequest("/products", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        savedProduct = fromDatabase(response.product || response.data || payload);
        if (typeof setProducts === "function") {
          setProducts((prev) => [savedProduct, ...prev]);
        }
        setSuccessToast(`✓ Added "${savedProduct.name}" to MySQL database.`);
      }

      await loadProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message || "Failed to save product to MySQL database.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (product) => {
    const nextStatus = product.status === "Published" ? "Archived" : "Published";
    try {
      await apiRequest(`/products/${encodeURIComponent(product.id)}`, {
        method: "PUT",
        body: JSON.stringify({
          status: nextStatus,
          is_active: nextStatus === "Published"
        })
      });
      if (typeof setProducts === "function") {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? { ...p, status: nextStatus, is_active: nextStatus === "Published" }
              : p
          )
        );
      }
      setSuccessToast(`✓ Product marked as ${nextStatus}.`);
      await loadProducts();
    } catch (err) {
      setError(err.message || `Failed to update status for ${product.name}.`);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name || `Product #${id}`}"?\n\nThis will remove or archive it in your live database.`
    );
    if (!confirmed) return;

    try {
      await apiRequest(`/products/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (typeof setProducts === "function") {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
      setSuccessToast(`✓ Deleted "${name || `Product #${id}`}".`);
      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to delete product from database.");
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "category" && !editingProduct) {
        const presets = PRESET_IMAGES[value] || [];
        if (presets.length > 0 && (!prev.imageMain || Object.values(PRESET_IMAGES).flat().some(p => p.url === prev.imageMain))) {
          updated.imageMain = presets[0].url;
        }
      }
      return updated;
    });
  };

  // Preset toggle helpers for Colors & Storage
  const toggleColorPreset = (colorName) => {
    const current = parseList(formData.colors);
    const exists = current.some((c) => c.toLowerCase() === colorName.toLowerCase());
    const next = exists
      ? current.filter((c) => c.toLowerCase() !== colorName.toLowerCase())
      : [...current, colorName];
    updateField("colors", next.join(", "));
  };

  const toggleStoragePreset = (size) => {
    const current = parseList(formData.storage);
    const exists = current.some((s) => s.toLowerCase() === size.toLowerCase());
    const next = exists
      ? current.filter((s) => s.toLowerCase() !== size.toLowerCase())
      : [...current, size];
    updateField("storage", next.join(", "));
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .map(fromDatabase)
      .filter((product) => {
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !term ||
          product.name.toLowerCase().includes(term) ||
          product.id.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          (product.badge_text && product.badge_text.toLowerCase().includes(term));

        const matchesCategory =
          !activeCategoryFilter ||
          activeCategoryFilter === "All" ||
          product.category.toLowerCase() === activeCategoryFilter.toLowerCase();

        const matchesStatus =
          statusFilter === "All" ||
          product.status.toLowerCase() === statusFilter.toLowerCase();

        let matchesStock = true;
        if (stockFilter === "in-stock") matchesStock = product.stock >= 10;
        else if (stockFilter === "low-stock") matchesStock = product.stock > 0 && product.stock < 10;
        else if (stockFilter === "out-of-stock") matchesStock = product.stock === 0;

        return matchesSearch && matchesCategory && matchesStatus && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "stock-low") return a.stock - b.stock;
        if (sortBy === "stock-high") return b.stock - a.stock;
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "oldest") return Number(a.id) - Number(b.id);
        return Number(b.id) - Number(a.id);
      });
  }, [products, searchTerm, activeCategoryFilter, statusFilter, stockFilter, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const list = products.map(fromDatabase);
    return {
      total: list.length,
      published: list.filter((p) => p.status === "Published").length,
      lowStock: list.filter((p) => p.stock > 0 && p.stock < 10).length,
      outOfStock: list.filter((p) => p.stock === 0).length,
      categoriesCount: new Set(list.map((p) => p.category)).size
    };
  }, [products]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  // Price calculations in form
  const regularPrice = Number(formData.price) || 0;
  const discountPrice = Number(formData.discountPrice) || 0;
  const hasValidDiscount = discountPrice > 0 && discountPrice < regularPrice;
  const savingsAmt = hasValidDiscount ? regularPrice - discountPrice : 0;
  const savingsPct = hasValidDiscount ? Math.round((savingsAmt / regularPrice) * 100) : 0;

  return (
    <div className="products-view-container">
      {/* View Header with Apple Styling */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
          gap: "16px",
          flexWrap: "wrap"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", letterSpacing: "-0.03em", color: "#1d1d1f", margin: 0 }}>
              Product Catalog
            </h1>
            {activeCategoryFilter && activeCategoryFilter !== "All" && (
              <span
                style={{
                  background: "#f5f5f7",
                  border: "1px solid #d2d2d7",
                  color: "#1d1d1f",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600"
                }}
              >
                {activeCategoryFilter}
              </span>
            )}
          </div>
          <p style={{ color: "#6e6e73", fontSize: "14px", marginTop: "6px", maxWidth: "600px" }}>
            Create, update, manage variants, and publish Apple hardware and accessories directly to your live MySQL database.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            className="apple-secondary-btn"
            onClick={loadProducts}
            disabled={loading}
            title="Reload from MySQL"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <FiRefreshCw size={14} className={loading ? "spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            className="apple-primary-btn-submit"
            onClick={handleOpenAddModal}
          >
            <FiPlus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Modern KPI Stat Cards */}
      <div className="products-kpi-grid">
        <div className="kpi-card-modern">
          <div className="kpi-meta">
            <span className="kpi-label">Total Catalog</span>
            <span className="kpi-value">{stats.total}</span>
            <span className="kpi-subtext">Across {stats.categoriesCount} categories</span>
          </div>
          <div className="kpi-icon-bubble blue">
            <FiBox size={22} />
          </div>
        </div>

        <div className="kpi-card-modern">
          <div className="kpi-meta">
            <span className="kpi-label">Live on Store</span>
            <span className="kpi-value" style={{ color: "#166534" }}>{stats.published}</span>
            <span className="kpi-subtext">Published &amp; purchasable</span>
          </div>
          <div className="kpi-icon-bubble green">
            <FiCheckCircle size={22} />
          </div>
        </div>

        <div className="kpi-card-modern">
          <div className="kpi-meta">
            <span className="kpi-label">Low Inventory</span>
            <span className="kpi-value" style={{ color: "#b45309" }}>{stats.lowStock}</span>
            <span className="kpi-subtext">&lt; 10 units in stock</span>
          </div>
          <div className="kpi-icon-bubble amber">
            <FiAlertTriangle size={22} />
          </div>
        </div>

        <div className="kpi-card-modern">
          <div className="kpi-meta">
            <span className="kpi-label">Out of Stock</span>
            <span className="kpi-value" style={{ color: stats.outOfStock > 0 ? "#dc2626" : "#6e6e73" }}>
              {stats.outOfStock}
            </span>
            <span className="kpi-subtext">Requires replenishment</span>
          </div>
          <div className="kpi-icon-bubble red">
            <FiArchive size={22} />
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successToast && (
        <div
          role="status"
          style={{
            background: "#dcfce7",
            color: "#166534",
            border: "1px solid #bbf7d0",
            padding: "12px 18px",
            marginBottom: "18px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 2px 8px rgba(22, 101, 52, 0.1)"
          }}
        >
          <FiCheckCircle size={18} />
          {successToast}
        </div>
      )}

      {error && !isModalOpen && (
        <div
          role="alert"
          style={{
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            padding: "12px 18px",
            marginBottom: "18px",
            borderRadius: "12px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <FiAlertTriangle size={18} />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            style={{ marginLeft: "auto", background: "none", border: "none", color: "#991b1b", cursor: "pointer" }}
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* Product Catalog Card with Toolbar */}
      <div className="table-card-wrapper">
        <div className="products-toolbar-modern">
          {/* Search Input */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <div className="search-box-modern">
              <FiSearch size={15} className="search-icon-svg" />
              <input
                type="text"
                placeholder="Search products, ID, category..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchTerm("")}
                >
                  <FiX size={14} />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <select
              className="filter-select-modern"
              value={activeCategoryFilter}
              onChange={(e) => handleCategoryFilterChange(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="filter-select-modern"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>

            {/* Stock Filter */}
            <select
              className="filter-select-modern"
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Stock Levels</option>
              <option value="in-stock">In Stock (10+)</option>
              <option value="low-stock">Low Stock (1-9)</option>
              <option value="out-of-stock">Out of Stock (0)</option>
            </select>
          </div>

          {/* Sort & Pagination Options */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "#6e6e73", fontWeight: "600" }}>Sort:</span>
            <select
              className="filter-select-modern"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock-low">Stock: Low to High</option>
              <option value="stock-high">Stock: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Product Table */}
        <div style={{ overflowX: "auto" }}>
          <table className="products-table-modern">
            <thead>
              <tr>
                <th style={{ width: "70px" }}>ID</th>
                <th>Product Information</th>
                <th>Price ($ USD)</th>
                <th>Stock Units</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "48px 20px", color: "#6e6e73" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                      <FiRefreshCw size={18} className="spin" />
                      <span>Loading catalog from MySQL database...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => {
                  const hasDiscount =
                    product.discountPrice !== "" &&
                    product.discountPrice != null &&
                    Number(product.discountPrice) < Number(product.price);

                  const discountPct = hasDiscount
                    ? Math.round(((Number(product.price) - Number(product.discountPrice)) / Number(product.price)) * 100)
                    : 0;

                  return (
                    <tr key={product.id} className="product-row-modern">
                      {/* Product ID */}
                      <td style={{ fontSize: "13px", fontWeight: "700", color: "#0071e3" }}>
                        #{product.id}
                      </td>

                      {/* Thumbnail & Meta */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <div className="product-thumb-box">
                            {product.imageMain ? (
                              <img
                                src={product.imageMain}
                                alt={product.name}
                                className="product-thumb-img"
                                onError={(e) => {
                                  e.target.src = placeholder;
                                }}
                              />
                            ) : (
                              <FiBox size={22} color="#86868b" />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: "700", color: "#1d1d1f", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                              {product.name}
                              {product.badge_text && (
                                <span className="product-badge-pill">
                                  {product.badge_text}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: "12px", color: "#6e6e73", marginTop: "3px" }}>
                              <span style={{ fontWeight: "600", color: "#475569" }}>{product.category}</span>
                              {product.colors && product.colors.length > 0 && (
                                <span style={{ marginLeft: "8px", color: "#94a3b8" }}>
                                  • {product.colors.length} color{product.colors.length > 1 ? "s" : ""}
                                </span>
                              )}
                              {product.storage && product.storage.length > 0 && (
                                <span style={{ marginLeft: "8px", color: "#94a3b8" }}>
                                  • {product.storage.join(" / ")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td>
                        {hasDiscount ? (
                          <div>
                            <div style={{ fontWeight: "700", color: "#1d1d1f", fontSize: "14px" }}>
                              ${Number(product.discountPrice).toLocaleString()}
                            </div>
                            <div style={{ fontSize: "11px", color: "#86868b", textDecoration: "line-through" }}>
                              ${Number(product.price).toLocaleString()}
                              <span style={{ marginLeft: "6px", color: "#166534", fontWeight: "700" }}>-{discountPct}%</span>
                            </div>
                          </div>
                        ) : (
                          <div style={{ fontWeight: "700", color: "#1d1d1f", fontSize: "14px" }}>
                            ${Number(product.price).toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Stock Level */}
                      <td>
                        <div style={{ display: "inline-flex", alignItems: "center" }}>
                          <span
                            className={`stock-indicator-dot ${
                              product.stock >= 10 ? "in-stock" : product.stock > 0 ? "low-stock" : "out-of-stock"
                            }`}
                          />
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color:
                                product.stock >= 10 ? "#166534" : product.stock > 0 ? "#92400e" : "#991b1b"
                            }}
                          >
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td>
                        <span
                          className={`status-badge ${product.status.toLowerCase()}`}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "600",
                            display: "inline-block"
                          }}
                        >
                          {product.status}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(product)}
                            title={product.status === "Published" ? "Archive Product" : "Publish Product"}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "8px",
                              border: "1px solid #e2e8f0",
                              background: "#ffffff",
                              cursor: "pointer",
                              color: product.status === "Published" ? "#d97706" : "#166534",
                              fontSize: "12px",
                              fontWeight: "600"
                            }}
                          >
                            {product.status === "Published" ? "Archive" : "Publish"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(product)}
                            title="Edit Product"
                            style={{
                              padding: "6px 8px",
                              borderRadius: "8px",
                              border: "1px solid #e2e8f0",
                              background: "#ffffff",
                              cursor: "pointer",
                              color: "#0071e3"
                            }}
                          >
                            <FiEdit2 size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(product.id, product.name)}
                            title="Delete Product"
                            style={{
                              padding: "6px 8px",
                              borderRadius: "8px",
                              border: "1px solid #fecaca",
                              background: "#fef2f2",
                              cursor: "pointer",
                              color: "#ef4444"
                            }}
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "48px 20px", color: "#6e6e73" }}>
                    <FiBox size={32} style={{ marginBottom: "10px", color: "#86868b" }} />
                    <div style={{ fontWeight: "600", fontSize: "15px", color: "#1d1d1f" }}>No products match your criteria.</div>
                    <div style={{ fontSize: "13px", marginTop: "4px" }}>Try adjusting your search terms or filters.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Count */}
        <div
          style={{
            padding: "16px 20px",
            background: "#ffffff",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <div style={{ fontSize: "13px", color: "#6e6e73" }}>
            Showing{" "}
            <strong>
              {filteredProducts.length === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1}
            </strong>{" "}
            to <strong>{Math.min(safeCurrentPage * itemsPerPage, filteredProducts.length)}</strong> of{" "}
            <strong>{filteredProducts.length}</strong> products
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid #d2d2d7",
                background: "#ffffff",
                cursor: safeCurrentPage <= 1 ? "not-allowed" : "pointer",
                opacity: safeCurrentPage <= 1 ? 0.5 : 1,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "13px"
              }}
            >
              <FiChevronLeft size={14} /> Previous
            </button>

            <span style={{ fontSize: "13px", color: "#1d1d1f", fontWeight: "600", padding: "0 8px" }}>
              Page {safeCurrentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid #d2d2d7",
                background: "#ffffff",
                cursor: safeCurrentPage >= totalPages ? "not-allowed" : "pointer",
                opacity: safeCurrentPage >= totalPages ? 0.5 : 1,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "13px"
              }}
            >
              Next <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ULTRA-MODERN APPLE ADD / EDIT PRODUCT MODAL */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="apple-modal-overlay">
          <div className="apple-modal-box">
            {/* Modal Header */}
            <div className="apple-modal-header">
              <div>
                <h3 className="apple-modal-title">
                  {editingProduct ? `Edit Product — ${editingProduct.name}` : "Add New Apple Product"}
                </h3>
                <p className="apple-modal-subtitle">
                  {editingProduct
                    ? "Update hardware pricing, specifications, variants, and stock inventory."
                    : "Configure details below. Product is saved to MySQL and immediately available."}
                </p>
              </div>
              <button
                type="button"
                className="apple-modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            {/* Segmented Modal Tabs */}
            <div className="modal-tabs-bar">
              <button
                type="button"
                className={`modal-tab-btn ${modalTab === "general" ? "active" : ""}`}
                onClick={() => setModalTab("general")}
              >
                <FiBox size={14} />
                General Info
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${modalTab === "pricing" ? "active" : ""}`}
                onClick={() => setModalTab("pricing")}
              >
                <FiDollarSign size={14} />
                Pricing &amp; Stock
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${modalTab === "media" ? "active" : ""}`}
                onClick={() => setModalTab("media")}
              >
                <FiImage size={14} />
                Media &amp; Photos
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${modalTab === "variants" ? "active" : ""}`}
                onClick={() => setModalTab("variants")}
              >
                <FiSliders size={14} />
                Variants &amp; Specs
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <div className="apple-modal-body">
                {/* Modal Error Alert */}
                {error && (
                  <div
                    style={{
                      background: "#fef2f2",
                      color: "#991b1b",
                      border: "1px solid #fecaca",
                      padding: "12px 16px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    <FiAlertTriangle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                {/* TAB 1: GENERAL INFO */}
                {modalTab === "general" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    <div className="form-grid-2">
                      <div className="modern-form-group">
                        <label>Product Name / Model Title *</label>
                        <input
                          type="text"
                          required
                          className="modern-input"
                          placeholder="e.g. iPhone 16 Pro Max"
                          value={formData.name}
                          onChange={(e) => updateField("name", e.target.value)}
                        />
                      </div>

                      <div className="modern-form-group">
                        <label>Category *</label>
                        <select
                          className="modern-input"
                          value={formData.category}
                          onChange={(e) => updateField("category", e.target.value)}
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="modern-form-group">
                        <label>Feature Tag / Badge</label>
                        <input
                          type="text"
                          className="modern-input"
                          placeholder="e.g. New, Apple Intelligence, Titanium"
                          value={formData.badge_text}
                          onChange={(e) => updateField("badge_text", e.target.value)}
                        />
                      </div>

                      <div className="modern-form-group">
                        <label>Publication Status</label>
                        <select
                          className="modern-input"
                          value={formData.status}
                          onChange={(e) => updateField("status", e.target.value)}
                        >
                          <option value="Published">Published (Active on Store)</option>
                          <option value="Draft">Draft (Internal review, hidden from store)</option>
                          <option value="Archived">Archived (Inactive)</option>
                        </select>
                      </div>
                    </div>

                    <div className="modern-form-group">
                      <label>Store Navigation Visibility</label>
                      <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginTop: "4px" }}>
                        <input
                          type="checkbox"
                          checked={formData.navVisibility}
                          onChange={(e) => updateField("navVisibility", e.target.checked)}
                          style={{ width: "18px", height: "18px", accentColor: "#0071e3" }}
                        />
                        <span style={{ fontSize: "13px", color: "#475569" }}>
                          Display in category banners and quick store navigation
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* TAB 2: PRICING & STOCK */}
                {modalTab === "pricing" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    <div className="form-grid-3">
                      <div className="modern-form-group">
                        <label>Regular Price ($ USD) *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          className="modern-input"
                          placeholder="e.g. 999.00"
                          value={formData.price}
                          onChange={(e) => updateField("price", e.target.value)}
                        />
                      </div>

                      <div className="modern-form-group">
                        <label>Discount Price ($ USD)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="modern-input"
                          placeholder="Optional promotional price"
                          value={formData.discountPrice}
                          onChange={(e) => updateField("discountPrice", e.target.value)}
                        />
                      </div>

                      <div className="modern-form-group">
                        <label>Stock Inventory *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="1"
                          className="modern-input"
                          placeholder="Units in warehouse"
                          value={formData.stock}
                          onChange={(e) => updateField("stock", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Live Pricing Breakdown Card */}
                    <div className="price-calculation-card">
                      <div className="price-calc-item">
                        <span className="price-calc-label">Effective Customer Price</span>
                        <span className="price-calc-val">
                          ${hasValidDiscount ? discountPrice.toFixed(2) : regularPrice.toFixed(2)}
                        </span>
                      </div>

                      <div className="price-calc-item">
                        <span className="price-calc-label">Customer Savings</span>
                        <span className="price-calc-val discount">
                          {hasValidDiscount ? `-$${savingsAmt.toFixed(2)} (${savingsPct}%)` : "Regular Price"}
                        </span>
                      </div>

                      <div className="price-calc-item">
                        <span className="price-calc-label">Total Inventory Valuation</span>
                        <span className="price-calc-val">
                          ${((hasValidDiscount ? discountPrice : regularPrice) * (Number(formData.stock) || 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: MEDIA & PHOTOGRAPHY */}
                {modalTab === "media" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    <div className="media-setup-card">
                      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
                        {/* Live Image Preview */}
                        <div
                          style={{
                            width: "160px",
                            height: "160px",
                            borderRadius: "14px",
                            border: "1px solid #d2d2d7",
                            background: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            flexShrink: 0,
                            padding: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                          }}
                        >
                          {formData.imageMain ? (
                            <img
                              src={formData.imageMain}
                              alt="Preview"
                              onError={(e) => {
                                e.target.src = placeholder;
                              }}
                              style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            />
                          ) : (
                            <div style={{ textAlign: "center", color: "#86868b", fontSize: "12px" }}>
                              <FiImage size={32} style={{ display: "block", margin: "0 auto 6px" }} />
                              Image Preview
                            </div>
                          )}
                        </div>

                        {/* Direct URL input and File upload */}
                        <div style={{ flex: 1, minWidth: "280px", display: "flex", flexDirection: "column", gap: "12px" }}>
                          <div className="modern-form-group">
                            <label>Main Image URL</label>
                            <input
                              type="text"
                              className="modern-input"
                              placeholder="https://images.unsplash.com/... or /uploads/..."
                              value={formData.imageMain}
                              onChange={(e) => updateField("imageMain", e.target.value)}
                            />
                          </div>

                          <div className="upload-dropzone-modern">
                            <label htmlFor="modal-file-upload" style={{ cursor: "pointer", display: "block" }}>
                              <FiUploadCloud size={28} style={{ color: "#0071e3", marginBottom: "6px" }} />
                              <div style={{ fontWeight: "600", fontSize: "13px", color: "#1d1d1f" }}>
                                {uploadingImage ? "Uploading to Server..." : "Choose Image File from Computer"}
                              </div>
                              <span style={{ fontSize: "11px", color: "#86868b" }}>
                                Supports PNG, JPG, WebP, AVIF up to 10MB
                              </span>
                            </label>
                            <input
                              id="modal-file-upload"
                              type="file"
                              accept="image/*"
                              disabled={uploadingImage}
                              onChange={handleImageFileUpload}
                              style={{ display: "none" }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Official Apple Presets for Current Category */}
                      {PRESET_IMAGES[formData.category] && (
                        <div style={{ marginTop: "18px" }}>
                          <span style={{ fontSize: "12px", color: "#1d1d1f", fontWeight: "700", display: "block", marginBottom: "8px" }}>
                            Official Apple Preset Photography:
                          </span>
                          <div className="presets-grid-modern">
                            {PRESET_IMAGES[formData.category].map((preset, idx) => {
                              const isSelected = formData.imageMain === preset.url;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  className={`preset-card-btn ${isSelected ? "selected" : ""}`}
                                  onClick={() => updateField("imageMain", preset.url)}
                                >
                                  <img src={preset.url} alt={preset.label} className="preset-thumb-img" />
                                  <span className="preset-label-text">{preset.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: VARIANTS & SPECS */}
                {modalTab === "variants" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    {/* Description */}
                    <div className="modern-form-group">
                      <label>Product Description &amp; Highlights</label>
                      <textarea
                        rows="3"
                        className="modern-textarea"
                        placeholder="Key hardware features, chip specifications, camera capabilities, and materials..."
                        value={formData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                      />
                    </div>

                    {/* Color Presets & Input */}
                    <div className="modern-form-group">
                      <label>Colors (Comma-separated)</label>
                      <input
                        type="text"
                        className="modern-input"
                        placeholder="Space Black, Silver, Natural Titanium"
                        value={formData.colors}
                        onChange={(e) => updateField("colors", e.target.value)}
                      />
                      <span style={{ fontSize: "11px", color: "#6e6e73", marginTop: "4px" }}>
                        Click to add/remove standard Apple color finishes:
                      </span>
                      <div className="color-swatches-grid">
                        {COLOR_PRESETS.map((color) => {
                          const isPicked = parseList(formData.colors).some(
                            (c) => c.toLowerCase() === color.name.toLowerCase()
                          );
                          return (
                            <button
                              key={color.name}
                              type="button"
                              className={`color-swatch-chip ${isPicked ? "active" : ""}`}
                              onClick={() => toggleColorPreset(color.name)}
                            >
                              <span className="color-dot-preview" style={{ background: color.hex }} />
                              {color.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Storage Options */}
                    <div className="modern-form-group">
                      <label>Storage Capacities (Comma-separated)</label>
                      <input
                        type="text"
                        className="modern-input"
                        placeholder="128GB, 256GB, 512GB, 1TB"
                        value={formData.storage}
                        onChange={(e) => updateField("storage", e.target.value)}
                      />
                      <span style={{ fontSize: "11px", color: "#6e6e73", marginTop: "4px" }}>
                        Click to toggle available storage capacities:
                      </span>
                      <div className="storage-pills-row">
                        {STORAGE_PRESETS.map((size) => {
                          const isPicked = parseList(formData.storage).some(
                            (s) => s.toLowerCase() === size.toLowerCase()
                          );
                          return (
                            <button
                              key={size}
                              type="button"
                              className={`storage-pill-btn ${isPicked ? "active" : ""}`}
                              onClick={() => toggleStoragePreset(size)}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="apple-modal-footer">
                <button
                  type="button"
                  className="apple-secondary-btn"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <div className="modal-nav-actions">
                  {modalTab !== "general" && (
                    <button
                      type="button"
                      className="apple-secondary-btn"
                      onClick={() => {
                        const tabs = ["general", "pricing", "media", "variants"];
                        const prevIdx = Math.max(0, tabs.indexOf(modalTab) - 1);
                        setModalTab(tabs[prevIdx]);
                      }}
                    >
                      Back
                    </button>
                  )}

                  {modalTab !== "variants" ? (
                    <button
                      type="button"
                      className="apple-primary-btn-submit"
                      onClick={() => {
                        const tabs = ["general", "pricing", "media", "variants"];
                        const nextIdx = Math.min(tabs.length - 1, tabs.indexOf(modalTab) + 1);
                        setModalTab(tabs[nextIdx]);
                      }}
                    >
                      Next Step <FiArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="apple-primary-btn-submit"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <FiRefreshCw size={14} className="spin" />
                          Saving to MySQL...
                        </>
                      ) : editingProduct ? (
                        "Save Changes"
                      ) : (
                        "Create Product"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
