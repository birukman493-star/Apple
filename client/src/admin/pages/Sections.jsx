import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiLayers, FiImage } from 'react-icons/fi';

export default function Sections({ sections = [], setSections, products = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const initialFormState = {
    id: '',
    title: '',
    subtitle: '',
    targetPage: 'iPhone page',
    category: 'iPhone',
    linkedProductId: '',
    buttonText: 'Learn More',
    buttonLink: '/store',
    bannerImage: '',
    status: 'Published'
  };

  const [formData, setFormData] = useState(initialFormState);

  // Open modal for Create or Edit
  const handleOpenModal = (section = null) => {
    if (section) {
      setEditingSection(section);
      setFormData(section);
    } else {
      setEditingSection(null);
      setFormData({ ...initialFormState, id: `SEC-0${sections.length + 1}` });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSection(null);
    setFormData(initialFormState);
  };

  // Image File Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, bannerImage: imageUrl }));
    }
  };

  // Save Section Form Action
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSection) {
      setSections(sections.map(s => s.id === editingSection.id ? formData : s));
    } else {
      setSections([...sections, formData]);
    }
    handleCloseModal();
  };

  // Delete Section Action
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this website section?')) {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  const filteredSections = sections.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.targetPage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content-view">
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Website Sections (CMS)</h1>
          <p>Design and manage landing page banners, hero sections, and featured store promotions.</p>
        </div>
        <button className="primary-btn" onClick={() => handleOpenModal()}>
          <FiPlus size={16} /> Add New Section
        </button>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="search-container" style={{ width: '300px' }}>
            <FiSearch size={16} />
            <input 
              type="text" 
              placeholder="Search sections or target pages..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>{filteredSections.length} CMS sections</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Banner / Preview</th>
              <th>Section Title</th>
              <th>Target Page</th>
              <th>Linked Product</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSections.map(sec => {
              const linkedProd = products.find(p => p.id === sec.linkedProductId);

              return (
                <tr key={sec.id}>
                  <td>
                    <div style={{ width: '80px', height: '45px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {sec.bannerImage ? (
                        <img src={sec.bannerImage} alt={sec.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <FiImage size={18} color="#94a3b8" />
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{sec.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{sec.subtitle || 'No subtitle'}</div>
                  </td>
                  <td><span className="status-badge draft">{sec.targetPage}</span></td>
                  <td style={{ fontWeight: 600 }}>{linkedProd ? linkedProd.name : 'None'}</td>
                  <td>
                    <span className={`status-badge ${sec.status === 'Published' ? 'published' : 'draft'}`}>
                      {sec.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="icon-btn" onClick={() => handleOpenModal(sec)} title="Edit Section"><FiEdit2 size={14} /></button>
                      <button className="icon-btn" onClick={() => handleDelete(sec.id)} title="Delete Section" style={{ color: '#ef4444' }}><FiTrash2 size={14} /></button>
                    </div>
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
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingSection ? 'Edit Website Section' : 'Add New Website Section'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Target Page</label>
                    <select 
                      value={formData.targetPage} 
                      onChange={(e) => setFormData({ ...formData, targetPage: e.target.value })}
                    >
                      <option value="Home page">Home page</option>
                      <option value="iPhone page">iPhone page</option>
                      <option value="Mac page">Mac page</option>
                      <option value="Watch page">Watch page</option>
                      <option value="AirPods page">AirPods page</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Category Assignment</label>
                    <select 
                      value={formData.category} 
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="iPhone">iPhone</option>
                      <option value="Mac">Mac</option>
                      <option value="Watch">Watch</option>
                      <option value="AirPods">AirPods</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Link Store Product (Optional)</label>
                  <select 
                    value={formData.linkedProductId} 
                    onChange={(e) => setFormData({ ...formData, linkedProductId: e.target.value })}
                  >
                    <option value="">-- Select Product to Link --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Button Text</label>
                    <input 
                      type="text" 
                      value={formData.buttonText} 
                      onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Button Link / URL</label>
                    <input 
                      type="text" 
                      value={formData.buttonLink} 
                      onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Banner Image (URL or Desktop File Upload)</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="https://..." 
                      value={formData.bannerImage} 
                      onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })} 
                      style={{ flex: 1 }}
                    />
                    <label className="secondary-btn" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', height: '44px' }}>
                      Browse
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
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
                <button type="button" className="secondary-btn" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="primary-btn">Save Section</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}