'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';

const linesToArray = value =>
  (value || '')
    .split(/\r?\n|,/)
    .map(entry => entry.trim())
    .filter(Boolean);

const arrayToText = value => (Array.isArray(value) ? value.join('\n') : '');

const toSortValue = input => {
  const numeric = Number(input);
  return Number.isFinite(numeric) ? numeric : 0;
};

export default function CatalogueManagement({
  categories,
  setCategories,
  items,
  setItems,
  refreshCatalogue,
  showMessage,
  loading,
}) {
  const [activeTab, setActiveTab] = useState('items');
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [seedingCategoryDefaults, setSeedingCategoryDefaults] = useState(false);
  const [seedingItemDefaults, setSeedingItemDefaults] = useState(false);
  const [itemFormOpen, setItemFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingItem, setSavingItem] = useState(false);

  const emptyCategoryForm = () => ({
    name: '',
    description: '',
    parentId: '',
    accentColor: '',
    heroImage: '',
    badgeLabel: '',
    layoutPreset: 'default',
    sortOrder: '',
    isActive: true,
  });

  const emptyItemForm = () => ({
    name: '',
    description: '',
    categoryId: '',
    tier: 'standard',
    basePrice: '',
    highlights: '',
    tags: '',
    dietary: '',
    allergens: '',
    priceNote: '',
    heroImage: '',
    mediaGallery: '',
    spiceLevel: '',
    sortOrder: '',
    isActive: true,
    isRecommended: false,
  });

  const [categoryForm, setCategoryForm] = useState(() => emptyCategoryForm());
  const [itemForm, setItemForm] = useState(() => emptyItemForm());

  const reloadCatalogue = useCallback(async () => {
    if (typeof refreshCatalogue === 'function') {
      await refreshCatalogue();
    }
  }, [refreshCatalogue]);

  const handleSeedCategoryDefaults = useCallback(async () => {
    try {
      setSeedingCategoryDefaults(true);
      const response = await fetch('/api/admin/catalogue/seed', { method: 'POST' });
      const textResponse = await response.text();
      let result = {};
      if (textResponse) {
        try {
          result = JSON.parse(textResponse);
        } catch (error) {
          console.error('JSON parse error for catalogue seed:', error);
        }
      }

      if (!response.ok || result.error) {
        showMessage(result.error || 'Failed to load default categories', 'error');
        return;
      }

      showMessage(result.message || 'Default categories added');
      await reloadCatalogue();
    } catch (error) {
      console.error('Error seeding default catalogue categories', error);
      showMessage('Failed to load default categories', 'error');
    } finally {
      setSeedingCategoryDefaults(false);
    }
  }, [reloadCatalogue, showMessage]);

  const handleSeedItemDefaults = useCallback(async () => {
    try {
      setSeedingItemDefaults(true);
      const response = await fetch('/api/admin/catalogue/seed/items', { method: 'POST' });
      const textResponse = await response.text();
      let result = {};
      if (textResponse) {
        try {
          result = JSON.parse(textResponse);
        } catch (error) {
          console.error('JSON parse error for catalogue item seed:', error);
        }
      }

      if (!response.ok || result.error) {
        showMessage(result.error || 'Failed to load default items', 'error');
        return;
      }

      showMessage(result.message || 'Default items added');
      await reloadCatalogue();
    } catch (error) {
      console.error('Error seeding default catalogue items', error);
      showMessage('Failed to load default items', 'error');
    } finally {
      setSeedingItemDefaults(false);
    }
  }, [reloadCatalogue, showMessage]);

  const categoryLookup = useMemo(() => {
    const map = new Map();
    (Array.isArray(categories) ? categories : []).forEach(category => {
      if (category && category._id) {
        map.set(category._id, category);
      }
    });
    return map;
  }, [categories]);

  const orderedCategories = useMemo(() => {
    const list = Array.isArray(categories) ? [...categories] : [];
    list.sort((a, b) => {
      const diff = toSortValue(a?.sortOrder) - toSortValue(b?.sortOrder);
      if (diff !== 0) return diff;
      return (a?.name || '').localeCompare(b?.name || '');
    });
    return list;
  }, [categories]);

  const categoryOptions = useMemo(() => {
    return orderedCategories.map(category => {
      const parent = category?.parentId ? categoryLookup.get(category.parentId) : null;
      const label = parent ? `${parent.name} > ${category.name}` : category.name;
      return { value: category._id, label };
    });
  }, [orderedCategories, categoryLookup]);

  const orderedItems = useMemo(() => {
    const list = Array.isArray(items) ? [...items] : [];
    list.sort((a, b) => {
      const categoryA = categoryLookup.get(a?.categoryId)?.name || '';
      const categoryB = categoryLookup.get(b?.categoryId)?.name || '';
      const categoryCompare = categoryA.localeCompare(categoryB);
      if (categoryCompare !== 0) return categoryCompare;
      const sortCompare = toSortValue(a?.sortOrder) - toSortValue(b?.sortOrder);
      if (sortCompare !== 0) return sortCompare;
      const tierCompare = (a?.tier || '').localeCompare(b?.tier || '');
      if (tierCompare !== 0) return tierCompare;
      return (a?.name || '').localeCompare(b?.name || '');
    });
    return list;
  }, [items, categoryLookup]);

  const getCategoryLabel = useCallback(categoryId => {
    const category = categoryLookup.get(categoryId);
    if (!category) return 'Unassigned';
    if (category.parentId) {
      const parent = categoryLookup.get(category.parentId);
      return parent ? `${parent.name} > ${category.name}` : category.name;
    }
    return category.name;
  }, [categoryLookup]);

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryForm(emptyCategoryForm());
  };

  const resetItemForm = () => {
    setEditingItem(null);
    setItemForm(emptyItemForm());
  };

  const handleCategorySubmit = async event => {
    event.preventDefault();
    if (savingCategory) return;
    setSavingCategory(true);
    try {
      const method = editingCategory ? 'PUT' : 'POST';
      const url = editingCategory
        ? `/api/admin/catalogue/categories/${editingCategory._id}`
        : '/api/admin/catalogue/categories';
      const payload = {
        name: categoryForm.name,
        description: categoryForm.description,
        parentId: categoryForm.parentId || null,
        accentColor: categoryForm.accentColor || null,
        heroImage: categoryForm.heroImage || null,
        badgeLabel: categoryForm.badgeLabel || null,
        layoutPreset: categoryForm.layoutPreset || 'default',
        sortOrder: categoryForm.sortOrder === '' ? undefined : Number(categoryForm.sortOrder),
        isActive: categoryForm.isActive,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resultText = await response.text();
      const result = resultText ? JSON.parse(resultText) : {};
      if (!response.ok || result.error) {
        showMessage(result.error || 'Error saving category', 'error');
        return;
      }

      showMessage(result.message || 'Category saved successfully');
      resetCategoryForm();
      setCategoryFormOpen(false);
      await reloadCatalogue();
    } catch (error) {
      console.error('Error saving category', error);
      showMessage('Error saving category', 'error');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleCategoryEdit = category => {
    setActiveTab('categories');
    setCategoryFormOpen(true);
    setEditingCategory(category);
    setCategoryForm({
      name: category?.name || '',
      description: category?.description || '',
      parentId: category?.parentId || '',
      accentColor: category?.accentColor || '',
      heroImage: category?.heroImage || '',
      badgeLabel: category?.badgeLabel || '',
      layoutPreset: category?.layoutPreset || 'default',
      sortOrder: category?.sortOrder === undefined || category?.sortOrder === null
        ? ''
        : String(category.sortOrder),
      isActive: category?.isActive !== false,
    });
  };

  const handleCategoryDelete = async category => {
    if (!category?._id) return;
    if (!confirm(`Delete category "${category.name}"? Items must be reassigned first.`)) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/catalogue/categories/${category._id}`, { method: 'DELETE' });
      const resultText = await response.text();
      const result = resultText ? JSON.parse(resultText) : {};
      if (!response.ok || result.error) {
        showMessage(result.error || 'Error deleting category', 'error');
        return;
      }
      showMessage(result.message || 'Category deleted');
      if (typeof setCategories === 'function') {
        setCategories(prev => (Array.isArray(prev) ? prev.filter(item => item._id !== category._id) : prev));
      }
      await reloadCatalogue();
    } catch (error) {
      console.error('Error deleting category', error);
      showMessage('Error deleting category', 'error');
    }
  };

  const handleItemSubmit = async event => {
    event.preventDefault();
    if (savingItem) return;
    setSavingItem(true);
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem
        ? `/api/admin/catalogue/items/${editingItem._id}`
        : '/api/admin/catalogue/items';
      const basePriceValue =
        itemForm.basePrice === '' || itemForm.basePrice === null
          ? undefined
          : Number(itemForm.basePrice)

      const payload = {
        name: itemForm.name,
        description: itemForm.description,
        categoryId: itemForm.categoryId,
        tier: itemForm.tier,
        basePrice:
          Number.isFinite(basePriceValue) && basePriceValue >= 0 ? basePriceValue : undefined,
        highlights: linesToArray(itemForm.highlights),
        tags: linesToArray(itemForm.tags),
        dietary: linesToArray(itemForm.dietary),
        allergens: linesToArray(itemForm.allergens),
        priceNote: itemForm.priceNote,
        heroImage: itemForm.heroImage || null,
        mediaGallery: linesToArray(itemForm.mediaGallery),
        spiceLevel: itemForm.spiceLevel || null,
        sortOrder: itemForm.sortOrder === '' ? undefined : Number(itemForm.sortOrder),
        isActive: itemForm.isActive,
        isRecommended: itemForm.isRecommended,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resultText = await response.text();
      const result = resultText ? JSON.parse(resultText) : {};
      if (!response.ok || result.error) {
        showMessage(result.error || 'Error saving item', 'error');
        return;
      }

      showMessage(result.message || 'Item saved successfully');
      resetItemForm();
      setItemFormOpen(false);
      await reloadCatalogue();
    } catch (error) {
      console.error('Error saving catalogue item', error);
      showMessage('Error saving item', 'error');
    } finally {
      setSavingItem(false);
    }
  };

  const handleItemEdit = item => {
    setActiveTab('items');
    setItemFormOpen(true);
    setEditingItem(item);
    setItemForm({
      name: item?.name || '',
      description: item?.description || '',
      categoryId: item?.categoryId || '',
      tier: item?.tier || 'standard',
      basePrice:
        item?.basePrice === undefined || item?.basePrice === null ? '' : String(item.basePrice),
      highlights: arrayToText(item?.highlights),
      tags: arrayToText(item?.tags),
      dietary: arrayToText(item?.dietary),
      allergens: arrayToText(item?.allergens),
      priceNote: item?.priceNote || '',
      heroImage: item?.heroImage || '',
      mediaGallery: arrayToText(item?.mediaGallery),
      spiceLevel: item?.spiceLevel || '',
      sortOrder: item?.sortOrder === undefined || item?.sortOrder === null
        ? ''
        : String(item.sortOrder),
      isActive: item?.isActive !== false,
      isRecommended: Boolean(item?.isRecommended),
    });
  };

  const handleItemDelete = async item => {
    if (!item?._id) return;
    if (!confirm(`Delete "${item.name}" from the food catalogue?`)) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/catalogue/items/${item._id}`, { method: 'DELETE' });
      const resultText = await response.text();
      const result = resultText ? JSON.parse(resultText) : {};
      if (!response.ok || result.error) {
        showMessage(result.error || 'Error deleting item', 'error');
        return;
      }
      showMessage(result.message || 'Item deleted');
      if (typeof setItems === 'function') {
        setItems(prev => (Array.isArray(prev) ? prev.filter(entry => entry._id !== item._id) : prev));
      }
      await reloadCatalogue();
    } catch (error) {
      console.error('Error deleting catalogue item', error);
      showMessage('Error deleting item', 'error');
    }
  };

  const toggleCategoryForm = () => {
    if (categoryFormOpen) {
      resetCategoryForm();
      setCategoryFormOpen(false);
    } else {
      resetCategoryForm();
      setCategoryFormOpen(true);
    }
  };

  const toggleItemForm = () => {
    if (itemFormOpen) {
      resetItemForm();
      setItemFormOpen(false);
    } else {
      resetItemForm();
      setItemFormOpen(true);
    }
  };

  const initialLoading = loading && orderedCategories.length === 0 && orderedItems.length === 0;

  if (initialLoading) {
    return <div className="loading">Loading catalogue data...</div>;
  }

  return (
    <div className="management-section">
      <div className="btn-group" style={{ marginBottom: '20px' }}>
        <button
          type="button"
          className={`btn ${activeTab === 'items' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('items')}
        >
          Manage Items
        </button>
        <button
          type="button"
          className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('categories')}
        >
          Manage Categories
        </button>
      </div>
      <div className="btn-group" style={{ marginBottom: '20px' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleSeedCategoryDefaults}
          disabled={seedingCategoryDefaults}
        >
          {seedingCategoryDefaults ? 'Loading defaults...' : 'Load default categories'}
        </button>
      </div>

      <div className="item-card" style={{ marginBottom: '20px' }}>
        <h3>Client WhatsApp enquiries</h3>
        <p className="text-sm text-gray-600">Allow visitors to compile dishes and send you the request straight on WhatsApp.</p>
        {settingsError && (
          <p className="text-sm text-red-500">{settingsError}</p>
        )}
        <div className="form-group" style={{ marginTop: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={enquiryEnabled}
              onChange={event => setEnquiryEnabled(event.target.checked)}
              style={{ marginRight: '10px' }}
              disabled={enquirySettingsLoading}
            />
            Enable catalogue enquiries via WhatsApp
          </label>
        </div>
        <div className="form-group">
          <label>WhatsApp number (with country code)</label>
          <input
            type="tel"
            value={whatsappNumber}
            onChange={event => setWhatsappNumber(event.target.value)}
            placeholder="+14161234567"
            disabled={!enquiryEnabled || enquirySettingsLoading}
          />
        </div>
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveEnquirySettings}
            disabled={savingEnquirySettings || enquirySettingsLoading}
          >
            {savingEnquirySettings ? 'Saving...' : 'Save enquiry settings'}
          </button>
        </div>
      </div>

      {activeTab === 'categories' && (
        <>
          <div className="btn-group">
            <button type="button" className="btn btn-primary" onClick={toggleCategoryForm}>
              {categoryFormOpen ? 'Close Category Form' : 'Add New Category'}
            </button>
          </div>

          {categoryFormOpen && (
            <form onSubmit={handleCategorySubmit} style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={event => setCategoryForm({ ...categoryForm, name: event.target.value })}
                  placeholder="Category name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={event => setCategoryForm({ ...categoryForm, description: event.target.value })}
                  placeholder="Short overview for the catalogue page"
                  rows={2}
                />
              </div>
              <div className="form-group">
                <label>Parent category (optional)</label>
                <select
                  value={categoryForm.parentId}
                  onChange={event => setCategoryForm({ ...categoryForm, parentId: event.target.value })}
                >
                  <option value="">None (top level)</option>
                  {orderedCategories
                    .filter(category => !editingCategory || category._id !== editingCategory._id)
                    .map(category => {
                      const optionLabel = categoryOptions.find(option => option.value === category._id)?.label || category.name;
                      return (
                        <option key={category._id} value={category._id}>
                          {optionLabel}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Badge label</label>
                  <input
                    type="text"
                    value={categoryForm.badgeLabel}
                    onChange={event => setCategoryForm({ ...categoryForm, badgeLabel: event.target.value })}
                    placeholder="e.g. Signature"
                  />
                </div>
                <div className="form-group">
                  <label>Accent color</label>
                  <input
                    type="text"
                    value={categoryForm.accentColor}
                    onChange={event => setCategoryForm({ ...categoryForm, accentColor: event.target.value })}
                    placeholder="#FF8A00"
                  />
                </div>
                <div className="form-group">
                  <label>Sort order</label>
                  <input
                    type="number"
                    value={categoryForm.sortOrder}
                    onChange={event => setCategoryForm({ ...categoryForm, sortOrder: event.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Hero image URL</label>
                <input
                  type="url"
                  value={categoryForm.heroImage}
                  onChange={event => setCategoryForm({ ...categoryForm, heroImage: event.target.value })}
                  placeholder="https://example.com/category.jpg"
                />
              </div>
              <div className="form-group">
                <label>Layout preset</label>
                <select
                  value={categoryForm.layoutPreset}
                  onChange={event => setCategoryForm({ ...categoryForm, layoutPreset: event.target.value })}
                >
                  <option value="default">Default</option>
                  <option value="split">Split (Standard vs Premium)</option>
                  <option value="grid">Grid</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={categoryForm.isActive}
                    onChange={event => setCategoryForm({ ...categoryForm, isActive: event.target.checked })}
                    style={{ marginRight: '10px' }}
                  />
                  Visible on public catalogue
                </label>
              </div>
              <div className="btn-group">
                <button type="submit" className="btn btn-primary" disabled={savingCategory}>
                  {savingCategory ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={toggleCategoryForm}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="items-list">
            {orderedCategories.length === 0 && (
              <p className="empty-note">No categories created yet.</p>
            )}
            {orderedCategories.map(category => (
              <div key={category._id} className="item-card">
                <h4>{category.name}</h4>
                {category.badgeLabel && (
                  <p><strong>Badge:</strong> {category.badgeLabel}</p>
                )}
                <p><strong>Status:</strong> {category.isActive === false ? 'Hidden' : 'Visible'}</p>
                <p><strong>Parent:</strong> {category.parentId ? getCategoryLabel(category.parentId) : 'Top level'}</p>
                {category.description && (
                  <p><strong>Description:</strong> {category.description}</p>
                )}
                <p><strong>Sort order:</strong> {category.sortOrder ?? 0}</p>
                <div className="item-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => handleCategoryEdit(category)}>
                    Edit
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => handleCategoryDelete(category)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'items' && (
        <>
          <div className="btn-group" style={{ marginBottom: '20px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSeedItemDefaults}
              disabled={seedingItemDefaults}
            >
              {seedingItemDefaults ? 'Loading default items...' : 'Load default items'}
            </button>
          </div>
          <div className="btn-group">
            <button type="button" className="btn btn-primary" onClick={toggleItemForm}>
              {itemFormOpen ? 'Close Item Form' : 'Add New Item'}
            </button>
          </div>

          {itemFormOpen && (
            <form onSubmit={handleItemSubmit} style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label>Item name</label>
                <input
                  type="text"
                  value={itemForm.name}
                  onChange={event => setItemForm({ ...itemForm, name: event.target.value })}
                  placeholder="Paneer Tikka"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={itemForm.description}
                  onChange={event => setItemForm({ ...itemForm, description: event.target.value })}
                  placeholder="Short description for the menu"
                  rows={2}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={itemForm.categoryId}
                    onChange={event => setItemForm({ ...itemForm, categoryId: event.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tier</label>
                  <select
                    value={itemForm.tier}
                    onChange={event => setItemForm({ ...itemForm, tier: event.target.value })}
                  >
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="signature">Signature</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Base price (per guest)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={itemForm.basePrice}
                    onChange={event => setItemForm({ ...itemForm, basePrice: event.target.value })}
                    placeholder="45"
                  />
                </div>
                <div className="form-group">
                  <label>Sort order</label>
                  <input
                    type="number"
                    value={itemForm.sortOrder}
                    onChange={event => setItemForm({ ...itemForm, sortOrder: event.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Highlights (one per line)</label>
                  <textarea
                    value={itemForm.highlights}
                    onChange={event => setItemForm({ ...itemForm, highlights: event.target.value })}
                    rows={2}
                    placeholder="Cheesy goodness\nSpicy option available"
                  />
                </div>
                <div className="form-group">
                  <label>Tags (comma or newline separated)</label>
                  <textarea
                    value={itemForm.tags}
                    onChange={event => setItemForm({ ...itemForm, tags: event.target.value })}
                    rows={2}
                    placeholder="vegan\nno-onion-garlic"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Dietary notes</label>
                  <textarea
                    value={itemForm.dietary}
                    onChange={event => setItemForm({ ...itemForm, dietary: event.target.value })}
                    rows={2}
                    placeholder="Jain option"
                  />
                </div>
                <div className="form-group">
                  <label>Allergens</label>
                  <textarea
                    value={itemForm.allergens}
                    onChange={event => setItemForm({ ...itemForm, allergens: event.target.value })}
                    rows={2}
                    placeholder="Contains nuts"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price note</label>
                  <input
                    type="text"
                    value={itemForm.priceNote}
                    onChange={event => setItemForm({ ...itemForm, priceNote: event.target.value })}
                    placeholder="Included in premium menu"
                  />
                </div>
                <div className="form-group">
                  <label>Spice level</label>
                  <input
                    type="text"
                    value={itemForm.spiceLevel}
                    onChange={event => setItemForm({ ...itemForm, spiceLevel: event.target.value })}
                    placeholder="Mild / Medium / Hot"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Primary image URL</label>
                <input
                  type="url"
                  value={itemForm.heroImage}
                  onChange={event => setItemForm({ ...itemForm, heroImage: event.target.value })}
                  placeholder="https://example.com/item.jpg"
                />
              </div>
              <div className="form-group">
                <label>Additional media URLs (one per line)</label>
                <textarea
                  value={itemForm.mediaGallery}
                  onChange={event => setItemForm({ ...itemForm, mediaGallery: event.target.value })}
                  rows={2}
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={itemForm.isActive}
                    onChange={event => setItemForm({ ...itemForm, isActive: event.target.checked })}
                    style={{ marginRight: '10px' }}
                  />
                  Visible on public catalogue
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={itemForm.isRecommended}
                    onChange={event => setItemForm({ ...itemForm, isRecommended: event.target.checked })}
                    style={{ marginRight: '10px' }}
                  />
                  Highlight as chef&apos;s recommendation
                </label>
              </div>
              <div className="btn-group">
                <button type="submit" className="btn btn-primary" disabled={savingItem}>
                  {savingItem ? 'Saving...' : editingItem ? 'Update Item' : 'Create Item'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={toggleItemForm}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="items-list">
            {orderedItems.length === 0 && (
              <p className="empty-note">No catalogue items yet. Add your first dish above.</p>
            )}
            {orderedItems.map(item => (
              <div key={item._id} className="item-card">
                <h4>{item.name}</h4>
                <p><strong>Category:</strong> {getCategoryLabel(item.categoryId)}</p>
                <p><strong>Tier:</strong> {item.tier || 'standard'}</p>
                {item.basePrice !== undefined && item.basePrice !== null && item.basePrice !== '' && (
                  <p>
                    <strong>Base price:</strong>{' '}
                    {Number(item.basePrice).toLocaleString('en-CA', {
                      style: 'currency',
                      currency: 'CAD',
                      maximumFractionDigits: 0,
                    })}
                  </p>
                )}
                {item.description && (
                  <p><strong>Description:</strong> {item.description}</p>
                )}
                {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                  <p><strong>Highlights:</strong> {item.highlights.join(', ')}</p>
                )}
                {item.priceNote && (
                  <p><strong>Price note:</strong> {item.priceNote}</p>
                )}
                <p><strong>Status:</strong> {item.isActive === false ? 'Hidden' : 'Visible'}</p>
                <div className="item-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => handleItemEdit(item)}>
                    Edit
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => handleItemDelete(item)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}







