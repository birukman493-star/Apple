import React, { useState } from 'react';
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiArchive,
  FiBox, FiAlertTriangle, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';

export default function Products({ products, setProducts, categoryFilter, setCategoryFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = ['iPhone', 'Mac', 'iPad', 'Watch', 'Vision', 'AirPods', 'TV & Home', 'Accessories'];

  // Initial Form Data template matching spec
  const initialFormState = {
    name: '',
    category: categoryFilter !== 'All' ? categoryFilter : 'iPhone',
    description: '',
    price: '',
    discountPrice: '',
    imageMain: '',
    imageGallery: '',
    stock: 50,
    colors: 'Space Gray, Silver',
    storage: '128GB, 256GB, 512GB',
    status: 'Published',
    navVisibility: true
  };

  const [formData, setFormData] = useState(initialFormState);

  // Filter, Search, and Sort Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = p.stock > 0 && p.stock <= 10;
    if (stockFilter === 'out') matchesStock = p.stock === 0;
    if (stockFilter === 'in') matchesStock = p.stock > 10;

    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'stock') return b.stock - a.stock;
    return b.id.localeCompare(a.id);
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      ...initialFormState,
      category: categoryFilter !== 'All' ? categoryFilter : 'iPhone'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      discountPrice: product.discountPrice || '',
      imageGallery: Array.isArray(product.imageGallery) ? product.imageGallery.join(', ') : (product.imageGallery || ''),
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || ''),
      storage: Array.isArray(product.storage) ? product.storage.join(', ') : (product.storage || '')
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    if (Number(formData.price) < 0 || Number(formData.stock) < 0) {
      alert('Price and Stock cannot be negative numbers.');
      return;
    }

    const formattedProduct = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
      stock: Number(formData.stock),
      colors: typeof formData.colors === 'string' ? formData.colors.split(',').map(s => s.trim()).filter(Boolean) : formData.colors,
      storage: typeof formData.storage === 'string' ? formData.storage.split(',').map(s => s.trim()).filter(Boolean) : formData.storage,
      imageGallery: typeof formData.imageGallery === 'string' ? formData.imageGallery.split(',').map(s => s.trim()).filter(Boolean) : formData.imageGallery
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...formattedProduct, id: p.id } : p));
    } else {
      const newProduct = {
        ...formattedProduct,
        id: `PROD-${Math.floor(100000 + Math.random() * 900000)}`
      };
      setProducts([newProduct, ...products]);
    }
    setIsModalOpen(false);
  };

  const handleArchive = (id) => {
    setProducts(products.map(p => p.id === id ? { ...p, status: 'Archived', navVisibility: false } : p));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product? Products attached to previous order history should ideally be Archived instead.')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="content-view">
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Product Management {categoryFilter !== 'All' ? `— ${categoryFilter}` : ''}</h1>
          <p>Add, update prices, manage variants, track stock, and control website publication.</p>
        </div>
        <button className="primary-btn" onClick={handleOpenAddModal}>
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      <div className="table-container">
        {/* Toolbar & Filters */}
        <div className="table-toolbar" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div className="filter-group" style={{ flexWrap: 'wrap', gap: '10px' }}>
            <div className="search-container" style={{ width: '240px' }}>
              <FiSearch size={16} />
              <input
                type="text"
                placeholder="Search name or ID..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>

            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="All">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>

            <select
              className="filter-select"
              value={stockFilter}
              onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="All">All Inventory</option>
              <option value="in">In Stock (&gt;10)</option>
              <option value="low">Low Stock (1-10)</option>
              <option value="out">Out of Stock (0)</option>
            </select>

            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest</option>
              <option value="name">Sort: Name</option>
              <option value="price-low">Sort: Price (Low to High)</option>
              <option value="price-high">Sort: Price (High to Low)</option>
              <option value="stock">Sort: Stock Quantity</option>
            </select>
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
            Showing {filteredProducts.length} products
          </div>
        </div>

        {/* Product Table */}
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name & Category</th>
              <th>Price & Discount</th>
              <th>Variants</th>
              <th>Stock Inventory</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 700, color: '#3b82f6', fontSize: '12px' }}>{p.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        flexShrink: 0
                      }}>
                        {p.imageMain ? (
                          <img
                            src={p.imageMain}
                            alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <FiBox size={20} style={{ color: '#94a3b8' }} />
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{p.category}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>${Number(p.price).toLocaleString()}</div>
                    {p.discountPrice && (
                      <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>
                        Discount: ${Number(p.discountPrice).toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: '12px', color: '#475569' }}>
                    <div><strong>Colors:</strong> {Array.isArray(p.colors) ? p.colors.join(', ') : p.colors || 'N/A'}</div>
                    <div><strong>Storage:</strong> {Array.isArray(p.storage) ? p.storage.join(', ') : p.storage || 'N/A'}</div>
                  </td>
                  <td>
                    {p.stock === 0 ? (
                      <span className="badge-pill" style={{ background: '#fee2e2', color: '#991b1b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <FiAlertTriangle size={12} /> Out of Stock
                      </span>
                    ) : p.stock <= 10 ? (
                      <span className="badge-pill warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <FiAlertTriangle size={12} /> Low Stock ({p.stock})
                      </span>
                    ) : (
                      <span style={{ fontWeight: 600, color: '#334155' }}>{p.stock} units</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${p.status ? p.status.toLowerCase() : 'draft'}`}>
                      {p.status || 'Published'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="icon-btn" style={{ display: 'inline-flex', marginRight: '6px' }} onClick={() => handleOpenEditModal(p)} title="Edit Product">
                      <FiEdit2 size={14} />
                    </button>
                    {p.status !== 'Archived' && (
                      <button className="icon-btn" style={{ display: 'inline-flex', marginRight: '6px', color: '#d97706' }} onClick={() => handleArchive(p.id)} title="Archive Product">
                        <FiArchive size={14} />
                      </button>
                    )}
                    <button className="icon-btn" style={{ display: 'inline-flex', color: '#ef4444' }} onClick={() => handleDelete(p.id)} title="Delete Product">
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  No products found matching your active filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="table-toolbar" style={{ justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', borderBottom: 'none' }}>
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            Page {currentPage} of {totalPages}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="secondary-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              style={{ opacity: currentPage === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <FiChevronLeft size={14} /> Previous
            </button>
            <button
              className="secondary-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              style={{ opacity: currentPage === totalPages ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Next <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ width: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>{editingProduct ? `Edit Product (${editingProduct.id})` : 'Add New Apple Product'}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSaveProduct}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., iPhone 17 Pro Max"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Describe key features, specs, and design details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Price ($ USD)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="999"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Optional Discount Price ($)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="899"
                      value={formData.discountPrice}
                      onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock Inventory</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="50"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Color Options (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="Natural Titanium, Black, White"
                      value={formData.colors}
                      onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Storage Capacities (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="256GB, 512GB, 1TB"
                      value={formData.storage}
                      onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Main Image (URL or Desktop File)</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="https://... or select file"
                        value={formData.imageMain}
                        onChange={(e) => setFormData({ ...formData, imageMain: e.target.value })}
                        style={{ flex: 1 }}
                      />
                      <input
                        type="file"
                        id="desktopImageUpload"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({ ...formData, imageMain: reader.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="secondary-btn"
                        style={{ height: '40px', padding: '0 12px', whiteSpace: 'nowrap', cursor: 'pointer' }}
                        onClick={() => document.getElementById('desktopImageUpload').click()}
                      >
                        Browse PC
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Image Gallery (comma-separated URLs)</label>
                    <input
                      type="text"
                      placeholder="img1.jpg, img2.jpg"
                      value={formData.imageGallery}
                      onChange={(e) => setFormData({ ...formData, imageGallery: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Published">Published (Visible in store)</option>
                    <option value="Draft">Draft (Hidden)</option>
                    <option value="Archived">Archived (Retained for history)</option>
                  </select>
                </div>

                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="navVisCheck"
                    checked={formData.navVisibility}
                    onChange={(e) => setFormData({ ...formData, navVisibility: e.target.checked })}
                  />
                  <label htmlFor="navVisCheck" style={{ cursor: 'pointer' }}>Show product in public navigation dropdown menu</label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}