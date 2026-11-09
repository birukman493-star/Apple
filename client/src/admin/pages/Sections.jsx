import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FiPlus, FiEdit2, FiTrash2, FiImage, FiBox, FiChevronRight,
  FiSave, FiX, FiArrowLeft, FiCheck, FiAlertCircle, FiLoader,
  FiEye, FiEyeOff, FiLayers, FiExternalLink, FiArrowUp, FiArrowDown
} from 'react-icons/fi';
import {
  CATEGORIES,
  SECTION_REGISTRY,
  LAYOUT_TYPES,
  normalise,
  categoryMatches
} from '../../constants/sectionRegistry';

const API_URL = 'http://localhost:5000/api';

const getToken = () =>
  localStorage.getItem('adminToken') || localStorage.getItem('token');

const blankForm = (category = 'iPhone') => ({
  section_name:          '',
  section_key:           '',
  title:                 '',
  subtitle:              '',
  description:           '',
  badge_text:            '',
  category,
  target_page:           category,
  product_id:            '',
  assigned_product_ids:  [],
  image_url:             '',
  video_url:             '',
  button_text:           'Learn More',
  button_link:           '#',
  secondary_button_text: '',
  secondary_button_link: '',
  layout_type:           'hero',
  background_theme:      'default',
  background_color:      '',
  display_order:         0,
  status:                'Draft',
});

export default function Sections({
  sections: propSections = [],
  setSections: propSetSections,
  products: propProducts = []
}) {
  // Master data
  const [dbSections, setDbSections] = useState([]);
  const [dbProducts, setDbProducts] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState(false);

  // Workflow selections
  const [selectedCat, setSelectedCat] = useState('iPhone');
  const [selectedSec, setSelectedSec] = useState(null);
  const [isNewMode,   setIsNewMode]   = useState(false);

  // Form
  const [formData, setFormData] = useState(blankForm('iPhone'));

  // Feedback
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  // ─── Fetch data from server ─────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const headers = {
        'Accept': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      };
      const [secRes, prodRes] = await Promise.all([
        fetch(`${API_URL}/admin/website-sections`, { headers }),
        fetch(`${API_URL}/products?status=all`,   { headers }).catch(() => fetch(`${API_URL}/products`, { headers })),
      ]);
      const [secData, prodData] = await Promise.all([
        secRes.json().catch(() => []),
        prodRes.json().catch(() => []),
      ]);

      const validSections = Array.isArray(secData) ? secData : [];
      const validProducts = Array.isArray(prodData) ? prodData : [];

      setDbSections(validSections);
      setDbProducts(validProducts);

      if (typeof propSetSections === 'function') {
        propSetSections(validSections);
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to the database.');
    } finally {
      setLoading(false);
    }
  }, [propSetSections]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Synchronize when propSections change
  useEffect(() => {
    if (Array.isArray(propSections) && propSections.length > 0 && dbSections.length === 0) {
      setDbSections(propSections);
    }
  }, [propSections, dbSections.length]);

  const allSections = dbSections.length > 0 ? dbSections : propSections;
  const allProducts = dbProducts.length > 0 ? dbProducts : propProducts;

  // ─── Filter sections for current category ───────────────────────────────────
  const currentCategoryObj = CATEGORIES.find(c => c.value === selectedCat) || CATEGORIES[0];
  const hasConfigurableSections = currentCategoryObj.hasSections;

  const sectionsForCat = useMemo(() => {
    if (!selectedCat || !hasConfigurableSections) return [];
    return allSections.filter(s => categoryMatches(s, selectedCat));
  }, [allSections, selectedCat, hasConfigurableSections]);

  const registrySectionsForCat = useMemo(() => {
    if (!selectedCat || !hasConfigurableSections) return [];
    return SECTION_REGISTRY[selectedCat] || [];
  }, [selectedCat, hasConfigurableSections]);

  const productsForCat = useMemo(() => {
    if (!selectedCat) return allProducts;
    return allProducts.filter(p => normalise(p.category) === normalise(selectedCat));
  }, [allProducts, selectedCat]);

  // Count badges
  const countByCat = useMemo(() => {
    const counts = {};
    allSections.forEach(s => {
      const match = CATEGORIES.find(c => categoryMatches(s, c.value));
      if (match) {
        counts[match.value] = (counts[match.value] || 0) + 1;
      }
    });
    return counts;
  }, [allSections]);

  // Check if current layout supports multi-product
  const currentLayoutDef = LAYOUT_TYPES.find(lt => lt.value === formData.layout_type) || LAYOUT_TYPES[0];
  const isMultiProductLayout = Boolean(currentLayoutDef.supportsMultiProduct);

  // ─── Core Workflow Handlers ─────────────────────────────────────────────────

  // 1. Category selector change
  const handleSelectCategory = (catValue) => {
    if (catValue === selectedCat) return;

    setSelectedCat(catValue);
    setError('');
    setSuccess('');

    // If currently selected section does not belong to the new category, clear it
    if (selectedSec && !categoryMatches(selectedSec, catValue)) {
      setSelectedSec(null);
      setIsNewMode(false);
      setFormData(blankForm(catValue));
    } else if (!selectedSec) {
      setFormData(blankForm(catValue));
    }
  };

  // 2. Section selector change (from dropdown or list)
  const handleSelectSection = (sec) => {
    if (!sec) {
      setSelectedSec(null);
      setIsNewMode(false);
      setFormData(blankForm(selectedCat));
      return;
    }

    setSelectedSec(sec);
    setIsNewMode(false);
    setError('');
    setSuccess('');

    const cat = sec.category || sec.target_page || selectedCat;

    // Parse assigned product IDs safely
    let pids = sec.assigned_product_ids;
    if (typeof pids === 'string') {
      try { pids = JSON.parse(pids); } catch { pids = []; }
    }
    if (!Array.isArray(pids)) {
      pids = sec.product_id ? [sec.product_id] : [];
    }

    setFormData({
      section_name:          sec.section_name          || '',
      section_key:           sec.section_key           || '',
      title:                 sec.title                 || '',
      subtitle:              sec.subtitle              || '',
      description:           sec.description           || '',
      badge_text:            sec.badge_text            || '',
      category:              cat,
      target_page:           sec.target_page           || cat,
      product_id:            sec.product_id            || '',
      assigned_product_ids:  pids,
      image_url:             sec.image_url             || '',
      video_url:             sec.video_url             || '',
      button_text:           sec.button_text           || 'Learn More',
      button_link:           sec.button_link           || '#',
      secondary_button_text: sec.secondary_button_text  || '',
      secondary_button_link: sec.secondary_button_link  || '',
      layout_type:           sec.layout_type           || 'hero',
      background_theme:      sec.background_theme      || 'default',
      background_color:      sec.background_color      || '',
      display_order:         sec.display_order         ?? 0,
      status:                sec.status                || 'Draft',
    });
  };

  // 3. Pick a registry section template
  const handleSelectRegistrySection = (regSec) => {
    setSelectedSec(null);
    setIsNewMode(true);
    setError('');
    setSuccess('');

    // Prepopulate candidate products from current category if multi-product
    const defaultPids = regSec.supportsMultiProduct
      ? productsForCat.slice(0, 4).map(p => p.id)
      : [];

    setFormData({
      section_name:          regSec.name,
      section_key:           regSec.key,
      title:                 regSec.name,
      subtitle:              regSec.description || '',
      description:           '',
      badge_text:            '',
      category:              selectedCat,
      target_page:           selectedCat,
      product_id:            defaultPids[0] || '',
      assigned_product_ids:  defaultPids,
      image_url:             '',
      video_url:             '',
      button_text:           'Learn More',
      button_link:           currentCategoryObj.path,
      secondary_button_text: 'Buy',
      secondary_button_link: '/store',
      layout_type:           regSec.defaultLayout || 'hero',
      background_theme:      'default',
      background_color:      '',
      display_order:         sectionsForCat.length + 1,
      status:                'Published',
    });
  };

  // 4. Start blank new section
  const handleNewSection = () => {
    setSelectedSec(null);
    setIsNewMode(true);
    setError('');
    setSuccess('');
    setFormData(blankForm(selectedCat));
  };

  // 5. Product group management: toggle product in curated list
  const handleToggleProductInGroup = (productId) => {
    setFormData(prev => {
      const pid = Number(productId);
      const exists = prev.assigned_product_ids.includes(pid);
      const updated = exists
        ? prev.assigned_product_ids.filter(id => id !== pid)
        : [...prev.assigned_product_ids, pid];

      return {
        ...prev,
        assigned_product_ids: updated,
        product_id: prev.product_id || (updated[0] ? String(updated[0]) : '')
      };
    });
  };

  // 6. Product group reordering: Move product Up / Down
  const handleMoveProductInGroup = (index, direction) => {
    setFormData(prev => {
      const list = [...prev.assigned_product_ids];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;

      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;

      return {
        ...prev,
        assigned_product_ids: list
      };
    });
  };

  // 7. Save Section
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (saving) return;

    if (!formData.title.trim()) {
      setError('Section heading is required.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${getToken()}`,
      };

      const payload = {
        ...formData,
        category:             formData.category || selectedCat,
        target_page:          formData.target_page || formData.category || selectedCat,
        product_id:           formData.product_id ? Number(formData.product_id) : null,
        assigned_product_ids: formData.assigned_product_ids || [],
      };

      const isEdit = !isNewMode && selectedSec && selectedSec.id;
      const url = isEdit
        ? `${API_URL}/admin/website-sections/${selectedSec.id}`
        : `${API_URL}/admin/website-sections`;

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save section.');

      setSuccess(
        isEdit
          ? `Section "${formData.title}" saved. Changes are live on ${formData.category} page.`
          : `Section "${formData.title}" created successfully!`
      );

      await loadData();

      if (!isEdit && data.section) {
        setIsNewMode(false);
        handleSelectSection(data.section);
      } else if (isEdit && data.section) {
        setSelectedSec(data.section);
      }
    } catch (err) {
      setError(err.message || 'Failed to save section.');
    } finally {
      setSaving(false);
    }
  };

  // 8. Delete Section
  const handleDelete = async () => {
    if (!selectedSec) return;
    if (!window.confirm(`Are you sure you want to delete "${selectedSec.title}"? This cannot be undone.`)) return;

    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_URL}/admin/website-sections/${selectedSec.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete section.');

      setSuccess('Section deleted.');
      setSelectedSec(null);
      setIsNewMode(false);
      setFormData(blankForm(selectedCat));
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete section.');
    } finally {
      setDeleting(false);
    }
  };

  // 9. Quick publish/unpublish toggle
  const handleToggleStatus = async (sec) => {
    const newStatus = sec.status === 'Published' ? 'Draft' : 'Published';
    try {
      const res = await fetch(`${API_URL}/admin/website-sections/${sec.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ ...sec, status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');

      await loadData();
      if (selectedSec && selectedSec.id === sec.id) {
        setSelectedSec(prev => ({ ...prev, status: newStatus }));
        setFormData(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      setError(err.message || 'Failed to toggle status.');
    }
  };

  const showManage = selectedCat && hasConfigurableSections && (selectedSec || isNewMode);

  return (
    <div className="content-view" style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px' }}>

      {/* ─── Page Title Header ─────────────────────────────────────────────── */}
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Website Sections (CMS)
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Select a Category (Target Page) to automatically view, manage, and edit the sections that exist on that frontend page.
          </p>
        </div>
        {loading && (
          <span style={{ color: '#0071e3', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <FiLoader size={14} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> Synchronizing database…
          </span>
        )}
      </div>

      {/* ─── Alerts ────────────────────────────────────────────────────────── */}
      {error && (
        <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, marginBottom: '16px', background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}>
          <FiAlertCircle size={16} />
          <span style={{ flex: 1 }}>{error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}><FiX size={15} /></button>
        </div>
      )}
      {success && (
        <div role="status" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, marginBottom: '16px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
          <FiCheck size={16} />
          <span style={{ flex: 1 }}>{success}</span>
          <button onClick={() => setSuccess('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}><FiX size={15} /></button>
        </div>
      )}

      {/* ─── PRIMARY WORKFLOW SELECTOR BAR ─────────────────────────────────── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '24px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        display: 'grid',
        gridTemplateColumns: 'minmax(240px, 320px) minmax(280px, 1fr) auto',
        gap: '20px',
        alignItems: 'end'
      }}>
        {/* Selector 1: Category (Target Page) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="category-target-page-select" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#334155' }}>
            Category (Target Page) *
          </label>
          <select
            id="category-target-page-select"
            value={selectedCat}
            onChange={(e) => handleSelectCategory(e.target.value)}
            style={{
              height: '42px',
              padding: '0 14px',
              border: '2px solid #0071e3',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#0f172a',
              background: '#f8fafc',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label} {countByCat[cat.value] ? `(${countByCat[cat.value]} sections)` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Selector 2: Section on that page */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="section-page-select" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#334155' }}>
            Section on {currentCategoryObj.label} Frontend Page *
          </label>
          <select
            id="section-page-select"
            disabled={!hasConfigurableSections}
            value={selectedSec ? String(selectedSec.id) : (isNewMode ? '__new__' : '')}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '__new__') {
                handleNewSection();
              } else if (val.startsWith('registry:')) {
                const regKey = val.replace('registry:', '');
                const reg = registrySectionsForCat.find(x => x.key === regKey);
                if (reg) handleSelectRegistrySection(reg);
              } else if (val) {
                const s = sectionsForCat.find(x => String(x.id) === String(val));
                if (s) handleSelectSection(s);
              } else {
                handleSelectSection(null);
              }
            }}
            style={{
              height: '42px',
              padding: '0 14px',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 500,
              color: hasConfigurableSections ? '#0f172a' : '#94a3b8',
              background: hasConfigurableSections ? '#ffffff' : '#f1f5f9',
              outline: 'none',
              cursor: hasConfigurableSections ? 'pointer' : 'not-allowed'
            }}
          >
            {!hasConfigurableSections ? (
              <option value="">No configurable sections on this page</option>
            ) : (
              <>
                <option value="">-- Select a Section ({sectionsForCat.length} configured) --</option>
                {sectionsForCat.length > 0 && (
                  <optgroup label={`── Configured Sections on ${currentCategoryObj.label} ──`}>
                    {sectionsForCat.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.title}  [{s.layout_type || 'hero'}] — {s.status}
                      </option>
                    ))}
                  </optgroup>
                )}
                {registrySectionsForCat.length > 0 && (
                  <optgroup label={`── Add Frontend Component Section ──`}>
                    {registrySectionsForCat.map(reg => (
                      <option key={`reg-${reg.key}`} value={`registry:${reg.key}`}>
                        + Configure: {reg.name} ({reg.defaultLayout})
                      </option>
                    ))}
                  </optgroup>
                )}
                <option value="__new__">+ Create Custom Section...</option>
              </>
            )}
          </select>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="button"
            id="btn-add-section-quick"
            disabled={!hasConfigurableSections}
            onClick={handleNewSection}
            style={{
              height: '42px',
              padding: '0 20px',
              background: hasConfigurableSections ? '#0071e3' : '#cbd5e1',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: hasConfigurableSections ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: hasConfigurableSections ? '0 2px 8px rgba(0,113,227,0.3)' : 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <FiPlus size={16} /> New Section
          </button>
        </div>
      </div>

      {/* ─── Non-configurable page message (e.g. Support) ─────────────────── */}
      {!hasConfigurableSections && (
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '48px 32px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
            No configurable sections for {currentCategoryObj.label}
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '520px', margin: '8px auto 20px auto', lineHeight: '1.5' }}>
            The {currentCategoryObj.label} page (<code>{currentCategoryObj.path}</code>) uses fixed support guides and does not render dynamic website sections.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {['Mac', 'iPhone', 'iPad', 'Watch', 'Store'].map(c => (
              <button
                key={c}
                type="button"
                onClick={() => handleSelectCategory(c)}
                style={{
                  padding: '8px 16px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#0071e3'
                }}
              >
                Switch to {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── 3-COLUMN APPLE-STYLE WORKFLOW ─────────────────────────────────── */}
      {hasConfigurableSections && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(210px, 240px) minmax(280px, 340px) 1fr',
          gap: '20px',
          alignItems: 'start'
        }}>

          {/* ── COLUMN 1: Categories / Target Pages ──────────────────────── */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748b' }}>
                1. Target Page
              </span>
            </div>

            <div>
              {CATEGORIES.map(cat => {
                const isActive = selectedCat === cat.value;
                const count    = countByCat[cat.value] || 0;
                return (
                  <div
                    key={cat.value}
                    id={`cat-nav-${cat.value.replace(/[^a-z0-9]/gi, '').toLowerCase()}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectCategory(cat.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSelectCategory(cat.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '11px 16px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f1f5f9',
                      background: isActive ? '#eff6ff' : '#ffffff',
                      borderLeft: isActive ? '3px solid #0071e3' : '3px solid transparent',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span style={{ fontSize: '16px', lineHeight: 1 }}>{cat.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: isActive ? 700 : 500, color: isActive ? '#0071e3' : '#1e293b', flex: 1 }}>
                      {cat.label}
                    </span>
                    {count > 0 && (
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', background: '#f1f5f9', borderRadius: '10px', padding: '1px 7px' }}>
                        {count}
                      </span>
                    )}
                    {isActive && <FiChevronRight size={14} color="#0071e3" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── COLUMN 2: Sections on Selected Page ───────────────────────── */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748b' }}>
                2. Sections on {currentCategoryObj.label} ({sectionsForCat.length})
              </span>
              <button
                type="button"
                onClick={handleNewSection}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#0071e3',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <FiPlus size={11} /> New
              </button>
            </div>

            <div style={{ maxHeight: '720px', overflowY: 'auto' }}>
              {sectionsForCat.length === 0 ? (
                <div style={{ padding: '36px 20px', textAlign: 'center', color: '#64748b' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>No sections saved yet</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>Click "+ New" or pick a template below to add one.</div>
                </div>
              ) : (
                sectionsForCat.map(sec => {
                  const isActive  = !isNewMode && selectedSec && selectedSec.id === sec.id;
                  const published = sec.status === 'Published';
                  const img       = sec.image_url || sec.product_image;

                  return (
                    <div
                      key={sec.id}
                      id={`sec-list-item-${sec.id}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectSection(sec)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSelectSection(sec)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f1f5f9',
                        background: isActive ? '#f0fdf4' : '#ffffff',
                        borderLeft: isActive ? '3px solid #10b981' : '3px solid transparent',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{
                        width: '46px',
                        height: '32px',
                        borderRadius: '6px',
                        background: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        {img ? (
                          <img src={img} alt={sec.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <FiImage size={15} color="#94a3b8" />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: isActive ? 700 : 600,
                          color: isActive ? '#059669' : '#0f172a',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {sec.title}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '8px',
                            background: published ? '#dcfce7' : '#f1f5f9',
                            color: published ? '#166534' : '#64748b'
                          }}>
                            {published ? '● Live' : '○ Draft'}
                          </span>
                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                            {sec.layout_type}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        title={published ? 'Unpublish to Draft' : 'Publish Section'}
                        onClick={(e) => { e.stopPropagation(); handleToggleStatus(sec); }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: published ? '#10b981' : '#94a3b8',
                          padding: '4px'
                        }}
                      >
                        {published ? <FiEye size={15} /> : <FiEyeOff size={15} />}
                      </button>
                    </div>
                  );
                })
              )}

              {/* Template Quick Starters */}
              {registrySectionsForCat.length > 0 && (
                <div style={{ padding: '12px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748b', marginBottom: '8px' }}>
                    Frontend Component Sections
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {registrySectionsForCat.map(reg => (
                      <button
                        key={reg.key}
                        type="button"
                        onClick={() => handleSelectRegistrySection(reg)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 10px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#334155',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span>{reg.name}</span>
                        <span style={{ color: '#0071e3', fontSize: '10px' }}>+ Setup</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── COLUMN 3: Section Manage & Edit Form ──────────────────────── */}
          {!showManage ? (
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              minHeight: '440px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '12px', color: '#0071e3' }}>✦</div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                Select a Section on {currentCategoryObj.label}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '360px', marginTop: '4px' }}>
                Pick one of the {sectionsForCat.length} sections from the list, choose a component, or click "+ New Section" to configure content and assigned products.
              </p>
              <button
                type="button"
                onClick={handleNewSection}
                style={{
                  marginTop: '16px',
                  padding: '8px 18px',
                  background: '#0071e3',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FiPlus size={14} /> Create Section for {currentCategoryObj.label}
              </button>
            </div>
          ) : (
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
              {/* Form Header */}
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid #f1f5f9',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748b' }}>
                    3. {isNewMode ? `Create New Section` : `Edit Section`}
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                    {isNewMode ? `New Section for ${currentCategoryObj.label}` : formData.title}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {!isNewMode && selectedSec && (
                    <button
                      type="button"
                      id="btn-delete-section"
                      onClick={handleDelete}
                      disabled={deleting}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        height: '34px',
                        padding: '0 14px',
                        background: 'transparent',
                        color: '#ef4444',
                        border: '1px solid #fca5a5',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <FiTrash2 size={12} /> {deleting ? 'Deleting…' : 'Delete'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setSelectedSec(null); setIsNewMode(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      height: '34px',
                      padding: '0 14px',
                      background: 'transparent',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <FiArrowLeft size={12} /> Cancel
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

                {/* Eyebrow Badge & Title */}
                <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor="form-badge" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#334155' }}>
                      Eyebrow Badge (Optional)
                    </label>
                    <input
                      id="form-badge"
                      type="text"
                      value={formData.badge_text}
                      onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                      placeholder="e.g. New, Apple Intelligence"
                      style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor="form-title" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#334155' }}>
                      Section Heading (Title) *
                    </label>
                    <input
                      id="form-title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. MacBook Pro — Mind-blowing. Head-turning."
                      style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Subtitle & Description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="form-subtitle" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#334155' }}>
                    Subtitle / Eyebrow Text
                  </label>
                  <input
                    id="form-subtitle"
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. Built for Apple Intelligence. M4 Pro and M4 Max."
                    style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="form-description" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#334155' }}>
                    Section Description / Narrative Body
                  </label>
                  <textarea
                    id="form-description"
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g. Titanium design with Camera Control. 48MP Fusion camera. A18 Pro chip."
                    style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                {/* Category + Layout Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor="form-category" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#334155' }}>
                      Category (Target Page) *
                    </label>
                    <select
                      id="form-category"
                      value={formData.category}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        setFormData({ ...formData, category: newCat, target_page: newCat });
                        setSelectedCat(newCat);
                      }}
                      style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
                    >
                      {CATEGORIES.filter(c => c.hasSections).map(c => (
                        <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor="form-layout" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#334155' }}>
                      Layout Component *
                    </label>
                    <select
                      id="form-layout"
                      value={formData.layout_type}
                      onChange={(e) => setFormData({ ...formData, layout_type: e.target.value })}
                      style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
                    >
                      {LAYOUT_TYPES.map(lt => (
                        <option key={lt.value} value={lt.value}>{lt.label} {lt.supportsMultiProduct ? '(Multi-Product)' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Single Primary Product Assignment */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="form-product" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#334155' }}>
                    Primary Linked Product (For Hero & Single Cards)
                  </label>
                  <select
                    id="form-product"
                    value={formData.product_id}
                    onChange={(e) => {
                      const pid = e.target.value;
                      const matched = allProducts.find(p => String(p.id) === String(pid));
                      setFormData(prev => ({
                        ...prev,
                        product_id: pid,
                        ...(matched && !prev.image_url ? { image_url: matched.image_url } : {})
                      }));
                    }}
                    style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
                  >
                    <option value="">-- No Linked Product --</option>
                    {productsForCat.length > 0 && (
                      <optgroup label={`── ${currentCategoryObj.label} Products ──`}>
                        {productsForCat.map(p => (
                          <option key={p.id} value={p.id}>{p.title} (${p.price_upfront || 0})</option>
                        ))}
                      </optgroup>
                    )}
                    {allProducts.filter(p => normalise(p.category) !== normalise(selectedCat)).length > 0 && (
                      <optgroup label="── Other Category Products ──">
                        {allProducts.filter(p => normalise(p.category) !== normalise(selectedCat)).map(p => (
                          <option key={p.id} value={p.id}>[{p.category}] {p.title} (${p.price_upfront || 0})</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>

                {/* Curated Product Group / Multi-Product Assignment (For Product Grid Showcase) */}
                {isMultiProductLayout && (
                  <div style={{
                    padding: '16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                          Curated Products for this Showcase ({formData.assigned_product_ids.length} selected)
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          Check products to include, and use the arrow buttons to reorder how they appear publicly.
                        </div>
                      </div>
                    </div>

                    {/* Ordered List of Selected Products */}
                    {formData.assigned_product_ids.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                          Public Display Order:
                        </div>
                        {formData.assigned_product_ids.map((pid, idx) => {
                          const prod = allProducts.find(p => Number(p.id) === Number(pid));
                          if (!prod) return null;
                          return (
                            <div key={pid} style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '6px 12px',
                              background: '#f8fafc',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0',
                              fontSize: '12px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontWeight: 700, color: '#0071e3', minWidth: '18px' }}>#{idx + 1}</span>
                                {prod.image_url && (
                                  <img src={prod.image_url} alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                                )}
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>{prod.title}</span>
                                <span style={{ color: '#64748b' }}>(${prod.price_upfront || 0})</span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <button
                                  type="button"
                                  title="Move Up"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveProductInGroup(idx, -1)}
                                  style={{ padding: '3px 6px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.3 : 1 }}
                                >
                                  <FiArrowUp size={12} />
                                </button>
                                <button
                                  type="button"
                                  title="Move Down"
                                  disabled={idx === formData.assigned_product_ids.length - 1}
                                  onClick={() => handleMoveProductInGroup(idx, 1)}
                                  style={{ padding: '3px 6px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: idx === formData.assigned_product_ids.length - 1 ? 'default' : 'pointer', opacity: idx === formData.assigned_product_ids.length - 1 ? 0.3 : 1 }}
                                >
                                  <FiArrowDown size={12} />
                                </button>
                                <button
                                  type="button"
                                  title="Remove from group"
                                  onClick={() => handleToggleProductInGroup(pid)}
                                  style={{ padding: '3px 6px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#ef4444', borderRadius: '4px', cursor: 'pointer', marginLeft: '6px' }}
                                >
                                  <FiX size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Checkbox Selector for Category Products */}
                    <div style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#ffffff', padding: '8px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                        Available {currentCategoryObj.label} Products:
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '6px' }}>
                        {productsForCat.map(p => {
                          const isChecked = formData.assigned_product_ids.includes(Number(p.id));
                          return (
                            <label key={p.id} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              background: isChecked ? '#eff6ff' : '#ffffff',
                              border: isChecked ? '1px solid #bfdbfe' : '1px solid #f1f5f9',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleProductInGroup(p.id)}
                              />
                              <span style={{ fontWeight: isChecked ? 700 : 500, color: isChecked ? '#0071e3' : '#1e293b' }}>
                                {p.title}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Banner Image URL */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="form-image" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#334155' }}>
                    Banner / Product Image (URL or Asset Path)
                  </label>
                  <input
                    id="form-image"
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://www.apple.com/... or /assets/..."
                    style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
                  />

                  {formData.image_url && (
                    <div style={{ marginTop: '6px', padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={formData.image_url} alt="Preview" style={{ height: '36px', borderRadius: '4px', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Image preview active</span>
                    </div>
                  )}
                </div>

                {/* Video URL (Optional) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="form-video" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#334155' }}>
                    Video Stream / Background Video (MP4 / WebM URL)
                  </label>
                  <input
                    id="form-video"
                    type="text"
                    value={formData.video_url || ''}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="e.g. /assets/video2.mp4 or https://..."
                    style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
                  />
                  {formData.video_url && (
                    <div style={{ marginTop: '6px', padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: '#0284c7' }}>🎬 Video URL specified</span>
                    </div>
                  )}
                </div>

                {/* Primary Button Text & Route */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor="form-btn-text" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#334155' }}>
                      Primary Button Text
                    </label>
                    <input
                      id="form-btn-text"
                      type="text"
                      value={formData.button_text}
                      onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                      placeholder="e.g. Learn More, Stream Now"
                      style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor="form-btn-link" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#334155' }}>
                      Primary Button Route
                    </label>
                    <input
                      id="form-btn-link"
                      type="text"
                      value={formData.button_link}
                      onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                      placeholder={`e.g. ${currentCategoryObj.path} or /store`}
                      style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Secondary Button (Optional e.g. Buy / Pre-order) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor="form-sec-btn-text" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#334155' }}>
                      Secondary Button Text (e.g. Buy)
                    </label>
                    <input
                      id="form-sec-btn-text"
                      type="text"
                      value={formData.secondary_button_text || ''}
                      onChange={(e) => setFormData({ ...formData, secondary_button_text: e.target.value })}
                      placeholder="e.g. Buy, Pre-order, Apply"
                      style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor="form-sec-btn-link" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#334155' }}>
                      Secondary Button Route
                    </label>
                    <input
                      id="form-sec-btn-link"
                      type="text"
                      value={formData.secondary_button_link || ''}
                      onChange={(e) => setFormData({ ...formData, secondary_button_link: e.target.value })}
                      placeholder="e.g. /store or /bag"
                      style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Theme & Background Color Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor="form-theme" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#334155' }}>
                      Background Theme
                    </label>
                    <select
                      id="form-theme"
                      value={formData.background_theme}
                      onChange={(e) => setFormData({ ...formData, background_theme: e.target.value })}
                      style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="default">Default</option>
                      <option value="dark">Dark Theme (Black #000)</option>
                      <option value="light">Light Theme (Pure White #fff)</option>
                      <option value="gray">Apple Gray (#f5f5f7)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor="form-bg-color" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#334155' }}>
                      Custom Background Color (Optional)
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        id="form-bg-color"
                        type="text"
                        value={formData.background_color || ''}
                        onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                        placeholder="e.g. #000000 or #fbfbfd"
                        style={{ flex: 1, height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
                      />
                      {formData.background_color && (
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: formData.background_color }} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Order & Status Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor="form-order" style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#334155' }}>
                      Page Order Position
                    </label>
                    <input
                      id="form-order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) || 0 })}
                      style={{ height: '40px', padding: '0 12px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#334155' }}>
                      Publish Status *
                    </label>
                    <div style={{ display: 'flex', gap: '12px', height: '40px', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: formData.status === 'Published' ? '#166534' : '#64748b' }}>
                        <input
                          type="radio"
                          name="section-status"
                          value="Published"
                          checked={formData.status === 'Published'}
                          onChange={() => setFormData({ ...formData, status: 'Published' })}
                        />
                        Published
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: formData.status === 'Draft' ? '#1e293b' : '#64748b' }}>
                        <input
                          type="radio"
                          name="section-status"
                          value="Draft"
                          checked={formData.status === 'Draft'}
                          onChange={() => setFormData({ ...formData, status: 'Draft' })}
                        />
                        Draft
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Footer */}
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <a
                    href={currentCategoryObj.path}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0071e3', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
                  >
                    View on {currentCategoryObj.label} Page <FiExternalLink size={13} />
                  </a>

                  <button
                    type="submit"
                    id="btn-save-section"
                    disabled={saving}
                    style={{
                      height: '42px',
                      padding: '0 24px',
                      background: saving ? '#94a3b8' : '#0071e3',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: saving ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(0,113,227,0.3)'
                    }}
                  >
                    <FiSave size={15} /> {saving ? 'Saving…' : (isNewMode ? 'Create Section' : 'Save Changes')}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
