/**
 * FilterPresets Component
 *
 * Save and manage custom filter combinations:
 * - Save current filters as preset
 * - Load saved presets
 * - Delete presets
 * - Share presets via URL
 *
 * Expected Impact: Faster repeat searches, improved UX
 */

'use client';

import React, { useState, useEffect } from 'react';

interface FilterPreset {
  id: string;
  name: string;
  filters: Record<string, (string | number)[]>;
  createdAt: string;
}

interface FilterPresetsProps {
  categorySlug: string;
  currentFilters: Record<string, (string | number)[]>;
  onApplyPreset: (filters: Record<string, (string | number)[]>) => void;
}

export function FilterPresets({
  categorySlug,
  currentFilters,
  onApplyPreset,
}: FilterPresetsProps) {
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showPresetsList, setShowPresetsList] = useState(false);

  const storageKey = `filter_presets_${categorySlug}`;

  // Load presets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setPresets(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load presets:', e);
      }
    }
  }, [storageKey]);

  // Save preset
  const savePreset = () => {
    if (!presetName.trim()) {
      alert('Please enter a preset name');
      return;
    }

    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name: presetName.trim(),
      filters: currentFilters,
      createdAt: new Date().toISOString(),
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    setPresetName('');
    setShowSaveDialog(false);
  };

  // Delete preset
  const deletePreset = (id: string) => {
    if (!confirm('Are you sure you want to delete this preset?')) return;

    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Apply preset
  const applyPreset = (preset: FilterPreset) => {
    onApplyPreset(preset.filters);
    setShowPresetsList(false);
  };

  // Share preset via URL
  const sharePreset = (preset: FilterPreset) => {
    const encoded = encodeURIComponent(JSON.stringify(preset.filters));
    const url = `${window.location.origin}${window.location.pathname}?filters=${encoded}`;

    navigator.clipboard.writeText(url).then(() => {
      alert('Preset link copied to clipboard!');
    });
  };

  // Check if current filters can be saved
  const hasActiveFilters = Object.keys(currentFilters).length > 0;

  return (
    <div className="relative">
      {/* Main Button */}
      <div className="flex items-center gap-2">
        {presets.length > 0 && (
          <button
            onClick={() => setShowPresetsList(!showPresetsList)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            Saved Filters ({presets.length})
          </button>
        )}

        {hasActiveFilters && (
          <button
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save Current Filters
          </button>
        )}
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Save Filter Preset
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preset Name
              </label>
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="e.g., Gaming Laptops Under 3M"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                autoFocus
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={savePreset}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setPresetName('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Presets List */}
      {showPresetsList && presets.length > 0 && (
        <div className="absolute top-full mt-2 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-40 w-80 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Saved Filter Presets
            </h4>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {presets.map((preset) => (
              <div key={preset.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-start justify-between gap-3">
                  <button
                    onClick={() => applyPreset(preset)}
                    className="flex-1 text-left"
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {preset.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {Object.keys(preset.filters).length} filter
                      {Object.keys(preset.filters).length !== 1 ? 's' : ''} •{' '}
                      {new Date(preset.createdAt).toLocaleDateString()}
                    </div>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => sharePreset(preset)}
                      className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                      title="Share preset"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => deletePreset(preset.id)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Delete preset"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showPresetsList && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowPresetsList(false)}
        />
      )}
    </div>
  );
}

export default FilterPresets;
