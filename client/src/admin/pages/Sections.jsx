import React, { useState } from 'react';
import { 
  FiGlobe, FiPlus, FiSearch, FiEdit2, FiTrash2, 
  FiEye, FiArrowUp, FiArrowDown, FiCheckCircle, FiClock, FiBox 
} from 'react-icons/fi';

export default function Sections({ products = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [previewSection, setPreviewSection] = useState(null);

  // Mock database state for website sections linked with products and images
  const [sections, setSections] = useState([
    {
      id: 1,
      page: 'iPhone page',
      category: 'iPhone',
      section_key: 'hero_main',
      title: 'iPhone 17 Pro Spotlight',
      subtitle: 'Titanium brilliance and M-series performance.',
      image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=512&hei=512',
      linkedProductId: 'PROD-101',
      button_text: 'Buy Now',
      button_link: '/iphone',
      sort_order: 1,
      status: 'Published',
      updated_at: '2026-10-14 12:30'
    },
    {
      id: 2,
      page: 'iPad page',
      category: 'iPad',
      section_key: 'ipad_nav_banner',
      title: 'iPad Pro M4 Showcase',
      subtitle: 'Thin. Fast. Unbelievably powerful.',
      image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-finish-select-202405-13inch-spaceblack?wid=512&hei=512',
      linkedProductId: 'PROD-103',
      button_text: 'Explore iPad Pro',
      button_link: '/ipad',
      sort_order: 2,
      status: 'Published',
      updated_at: '2026-10-13 15:45'
    }
  ]);

  const [formData, setFormData] = useState({
    page: 'iPhone page',
    category: 'iPhone',
    section_key: '',
    title: '',
    subtitle: '',
    image: '',
    linkedProductId: '',
    button_text: 'Learn More',
    button_link: '/store',
    status: 'Published'
  });

  const categories = ['iPhone', 'Mac', 'iPad', 'Watch', 'Vision', 'AirPods', 'TV & Home', 'Accessories'];
  const pages = ['Home page', 'iPhone page', 'Mac page', 'iPad page', 'Watch page', 'Store page'];

  const filteredSections = sections.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.page.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingSection(null);
    setFormData({
      page: 'iPhone page',
      category: 'iPhone',
      section_key: `section_${Date.now()}`,
      title: '',
      subtitle: '',
      image: '',
      linkedProductId: products[0]?.id || '',
      button_text: 'Buy Now',
      button_link: '/store',
      status: 'Published'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (section) => {
    setEditingSection(section);
    setFormData(section);
    setIsModalOpen(true);
  };

  const handleSaveSection = (e) => {
    e.preventDefault();
    if (editingSection) {
      setSections(sections.map(s => s.id === editingSection.id ? { 
        ...formData, 
        id: s.id, 
        sort_order: s.sort_order,
        updated_at: new Date().toISOString().slice(0, 16).replace('T', ' ') 
      } : s));
    } else {
      const newSec = {
        ...formData,
        id: sections.length + 1,
        section_key: formData.section_key || `sec_${Date.now()}`,
        sort_order: sections.length + 1,
        updated_at: new Date().toISOString().slice(0, 16).replace('T', ' ')
      };
      setSections([...sections, newSec]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this website section?')) {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  const togglePublishStatus = (id) => {
    setSections(sections.map(s => s.id === id ? { 
      ...s, 
      status: s.status === 'Published' ? 'Draft' : 'Published',
      updated_at: new Date().toISOString().slice(0, 16).replace('T', ' ')
    } : s));
  };

  const moveOrder = (index, direction) => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    
    const temp = newSections[index].sort_order;
    newSections[index].sort_order = newSections[targetIndex].sort_order;
    newSections[targetIndex].sort_order = temp;

    const tempItem = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = tempItem;

    setSections(newSections);
  };

  // Find linked product object if any
  const getLinkedProduct = (productId) => {
    return products.find(p => p.id === productId);
  };

  return (
    <div className="content-view">
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Website Sections & Banners</h1>
          <p>Manage promotional sections, link store products, assign categories, and control live layout displays.</p>
        </div>
        <button className="primary-btn" onClick={handleOpenAddModal}>
          <FiPlus size={16} /> Add Section
        </button>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="search-container" style={{ width: '320px' }}>
            <FiSearch size={16} />
            <input 
              type="text" 
              placeholder="Search sections, categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
            Total Sections: {sections.length}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Banner / Product</th>
              <th>Page & Category</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSections.map((s, idx) => {
              const linkedProd = getLinkedProduct(s.linkedProductId);
              const displayImage = s.image || linkedProd?.imageMain;

              return (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontWeight: 700, width: '20px' }}>{s.sort_order}</span>
                      <button className="icon-btn" style={{ width: '24px', height: '24px' }} onClick={() => moveOrder(idx, 'up')} title="Move Up">
                        <FiArrowUp size={12} />
                      </button>
                      <button className="icon-btn" style={{ width: '24px', height: '24px' }} onClick={() => moveOrder(idx, 'down')} title="Move Down">
                        <FiArrowDown size={12} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f1f5f9', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {displayImage ? (
                          <img src={displayImage} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <FiBox size={18} style={{ color: '#94a3b8' }} />
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{s.title}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {linkedProd ? `Linked Product: ${linkedProd.name}` : s.subtitle}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className="badge-pill" style={{ background: '#f1f5f9', color: '#334155', width: 'fit-content' }}>{s.page}</span>
                      <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 600 }}>Category: {s.category}</span>
                    </div>
                  </td>
                  <td>
                    <button 
                      type="button" 
                      className={`status-badge ${s.status.toLowerCase()}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                      onClick={() => togglePublishStatus(s.id)}
                      title="Click to toggle status"
                    >
                      {s.status === 'Published' ? <FiCheckCircle size={12} /> : <FiClock size={12} />}
                      {s.status}
                    </button>
                  </td>
                  <td style={{ fontSize: '12px', color: '#64748b' }}>{s.updated_at}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="icon-btn" style={{ display: 'inline-flex', marginRight: '6px' }} onClick={() => { setPreviewSection(s); setIsPreviewOpen(true); }} title="Preview">
                      <FiEye size={14} />
                    </button>
                    <button className="icon-btn" style={{ display: 'inline-flex', marginRight: '6px' }} onClick={() => handleOpenEditModal(s)} title="Edit">
                      <FiEdit2 size={14} />
                    </button>
                    <button className="icon-btn" style={{ display: 'inline-flex', color: '#ef4444' }} onClick={() => handleDelete(s.id)} title="Delete">
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Section Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ width: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>{editingSection ? 'Edit Website Section' : 'Add New Website Section'}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSaveSection}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Target Page</label>
                    <select 
                      value={formData.page}
                      onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                    >
                      {pages.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Category Assignment</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Link Store Product (Optional)</label>
                  <select 
                    value={formData.linkedProductId}
                    onChange={(e) => {
                      const prodId = e.target.value;
                      const selectedProd = products.find(p => p.id === prodId);
                      setFormData({ 
                        ...formData, 
                        linkedProductId: prodId,
                        title: selectedProd ? `${selectedProd.name} Spotlight` : formData.title,
                        image: selectedProd?.imageMain || formData.image
                      });
                    }}
                  >
                    <option value="">-- No Direct Product Link --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.category} - ${p.price})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Section Title</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g., iPhone 17 Pro Spotlight" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Subtitle / Supporting Text</label>
                  <input 
                    type="text" 
                    placeholder="Titanium brilliance and M4 power." 
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>Button Text</label>
                    <input 
                      type="text" 
                      placeholder="Buy Now" 
                      value={formData.button_text}
                      onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Button Link / URL</label>
                    <input 
                      type="text" 
                      placeholder="/iphone" 
                      value={formData.button_link}
                      onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Section Image (URL or Desktop File)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      placeholder="https://... or select file" 
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      style={{ flex: 1 }}
                    />
                    <input 
                      type="file" 
                      id="sectionImageUpload" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, image: reader.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <button 
                      type="button" 
                      className="secondary-btn" 
                      style={{ height: '40px', padding: '0 12px', whiteSpace: 'nowrap', cursor: 'pointer' }}
                      onClick={() => document.getElementById('sectionImageUpload').click()}
                    >
                      Browse PC
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn">Save Section</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && previewSection && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ width: '650px', textAlign: 'center', paddingBottom: '20px' }}>
            <div className="modal-header">
              <h3>Section Live Preview ({previewSection.page} — {previewSection.category})</h3>
              <button className="close-btn" onClick={() => setIsPreviewOpen(false)}>×</button>
            </div>
            <div className="modal-body" style={{ background: '#000000', color: '#ffffff', borderRadius: '12px', padding: '40px 24px', margin: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {(previewSection.image || getLinkedProduct(previewSection.linkedProductId)?.imageMain) && (
                <div style={{ width: '120px', height: '120px', marginBottom: '16px', borderRadius: '16px', overflow: 'hidden' }}>
                  <img 
                    src={previewSection.image || getLinkedProduct(previewSection.linkedProductId)?.imageMain} 
                    alt={previewSection.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
              )}
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#a1a1a6' }}>{previewSection.page} / {previewSection.category}</span>
              <h2 style={{ fontSize: '28px', fontWeight: '700', marginTop: '8px', color: '#f5f5f7' }}>{previewSection.title}</h2>
              <p style={{ fontSize: '15px', color: '#86868b', marginTop: '8px', marginBottom: '20px' }}>{previewSection.subtitle}</p>
              <div style={{ display: 'inline-block', background: '#0071e3', color: '#fff', padding: '10px 24px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                {previewSection.button_text} →
              </div>
            </div>
            <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="primary-btn" onClick={() => setIsPreviewOpen(false)}>Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}