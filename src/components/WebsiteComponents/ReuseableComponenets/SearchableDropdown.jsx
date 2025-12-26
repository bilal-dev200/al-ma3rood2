'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, ChevronRight } from 'lucide-react';

// Helper to normalize options (support both strings and objects)
function normalizeOption(option) {
  if (typeof option === 'string') {
    return { value: option, label: option, depth: 0, isParent: false };
  }
  return {
    value: option.id ?? option.value ?? option,
    label: option.label ?? option.name ?? option.value ?? String(option),
    depth: option.depth ?? 0,
    isParent: option.isParent ?? false,
    parentLabel: option.parentLabel ?? null,
    fullPath: option.fullPath ?? null,
  };
}

// Helper to get display value
function getOptionValue(option) {
  return normalizeOption(option).value;
}

// Helper to get display label
function getOptionLabel(option) {
  return normalizeOption(option).label;
}

const SearchableDropdown = ({
  options = [],
  value = '',
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  loading = false,
  className = '',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found',
  showHierarchy = false, // New prop for category hierarchy display
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
console.log("options in dropdown", options);
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option => {
        const normalized = normalizeOption(option);
        const searchLower = searchTerm.toLowerCase();
        return (
          normalized.label.toLowerCase().includes(searchLower) ||
          (normalized.fullPath && normalized.fullPath.toLowerCase().includes(searchLower))
        );
      });
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = (e) => {
    if (disabled || loading) return;
    if (e.target.closest('button[type="button"]')) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  const handleOptionSelect = (option) => {
    const normalized = normalizeOption(option);
    onChange(normalized.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  const selectedOption = options.find(option => {
    const normalized = normalizeOption(option);
    return normalized.value === value || normalized.value === String(value);
  });
  const displayValue = selectedOption ? getOptionLabel(selectedOption) : '';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <div
        className={`
          w-full px-4 py-3 border border-slate-200 rounded-2xl 
          focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
          flex items-center justify-between
          ${disabled || loading ? 'bg-slate-50 cursor-not-allowed' : 'bg-white hover:border-slate-300 cursor-pointer'}
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
          transition-colors
        `}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle(e);
          }
          if (e.key === 'Escape') {
            setIsOpen(false);
            setSearchTerm('');
          }
        }}
        tabIndex={disabled || loading ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={placeholder}
        {...props}
      >
        <span className={`text-sm ${!displayValue ? 'text-slate-500' : 'text-slate-900'}`}>
          {loading ? 'Loading...' : displayValue || placeholder}
        </span>
        <div className="flex items-center space-x-1">
          {displayValue && !disabled && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
          <ChevronDown 
            className={`w-4 h-4 text-slate-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-80 overflow-hidden"
          role="listbox"
          aria-label={`${placeholder} options`}
        >
          {/* Search Input */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                aria-label={`Search ${placeholder.toLowerCase()}`}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 #f1f5f9",
          }}>
            <style dangerouslySetInnerHTML={{
              __html: `
                .searchable-dropdown-options::-webkit-scrollbar {
                  width: 8px;
                }
                .searchable-dropdown-options::-webkit-scrollbar-track {
                  background: #f1f5f9;
                  border-radius: 4px;
                }
                .searchable-dropdown-options::-webkit-scrollbar-thumb {
                  background: #cbd5e1;
                  border-radius: 4px;
                }
                .searchable-dropdown-options::-webkit-scrollbar-thumb:hover {
                  background: #94a3b8;
                }
              `
            }} />
            <div className="searchable-dropdown-options">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const normalized = normalizeOption(option);
                  const isSelected = normalized.value === value || normalized.value === String(value);
                  const indentLevel = showHierarchy ? normalized.depth : 0;
                  
                  return (
                    <button
                      key={`${normalized.value}-${index}`}
                      type="button"
                      onClick={() => handleOptionSelect(option)}
                      className={`
                        w-full text-left transition-colors
                        ${isSelected 
                          ? 'bg-blue-50 text-blue-700 font-medium' 
                          : 'text-slate-900 hover:bg-slate-50'
                        }
                        ${normalized.isParent && showHierarchy ? 'border-b-2 border-slate-200 bg-slate-50/50' : ''}
                        ${normalized.depth > 0 && showHierarchy ? 'py-2' : 'py-2.5'}
                      `}
                      style={{
                        paddingLeft: showHierarchy ? `${0.75 + indentLevel * 1.25}rem` : '1rem',
                        paddingRight: '1rem',
                      }}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="flex items-center gap-2.5 w-full">
                        {/* {showHierarchy && normalized.depth > 0 && (
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <div className="w-4 h-px bg-slate-300"></div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        )} */}
                        {showHierarchy && normalized.depth === 0 && normalized.isParent && (
                          <div className="flex items-center gap-2 w-full">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                              {normalized.label}
                            </span>
                            <div className="flex-1 h-px bg-slate-200"></div>
                          </div>
                        )}
                        {(!showHierarchy || normalized.depth > 0 || !normalized.isParent) && (
                          <span className={`
                            text-sm
                            ${normalized.depth > 0 && showHierarchy ? 'text-slate-700' : ''}
                            ${normalized.depth === 0 && !normalized.isParent && showHierarchy ? 'font-medium text-slate-800' : ''}
                          `}>
                            {normalized.label}
                          </span>
                        )}
                        {showHierarchy && normalized.parentLabel && normalized.depth > 0 && (
                          <span className="text-xs text-slate-400 ml-auto flex-shrink-0 px-2 py-0.5 bg-slate-100 rounded">
                            {normalized.parentLabel}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-sm text-slate-500 text-center" role="status">
                  {emptyMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;