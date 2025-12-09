'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import SearchableDropdown from './SearchableDropdown';
import { useTranslation } from 'react-i18next';

const SearchableDropdownWithCustom = ({
  options = [],
  value = '',
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  loading = false,
  className = '',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found',
  customLabel = 'Not in list? Type it yourself',
  customPlaceholder = 'Type your custom value',
  ...props
}) => {
  const { t } = useTranslation();
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const hasAutoEnabledRef = useRef(false);
  const manualToggleRef = useRef(false); // Track manual checkbox toggles

  // Check if current value exists in options (for edit mode)
  const valueExistsInOptions = useMemo(() => {
    if (!value || !value.toString().trim()) return false;
    if (options.length === 0) return false;
    return options.some(option => 
      String(option).toLowerCase().trim() === String(value).toLowerCase().trim()
    );
  }, [value, options]);

  // Auto-enable custom input if value doesn't exist in options (edit mode)
  useEffect(() => {
    // Skip if user has manually toggled the checkbox
    if (manualToggleRef.current) return;

    // Only auto-switch once when component loads with a value that doesn't exist in options
    if (!loading && value && !hasAutoEnabledRef.current) {
      if (!valueExistsInOptions || options.length === 0) {
        setUseCustomInput(true);
        setCustomValue(value);
      }
      hasAutoEnabledRef.current = true;
    } else if (!value && !loading && !useCustomInput) {
      // Only reset if custom input is not currently active
      hasAutoEnabledRef.current = false;
    }
  }, [value, valueExistsInOptions, options.length, loading, useCustomInput]);

  // Sync customValue with value when in custom mode
  useEffect(() => {
    if (useCustomInput && value !== customValue) {
      setCustomValue(value || '');
    }
  }, [value, useCustomInput, customValue]);

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    console.log('aaaa checked', checked);
    
    // Mark that user manually toggled the checkbox
    manualToggleRef.current = true;
    setUseCustomInput(checked);
    
    if (checked) {
      // Switching to custom input - preserve current value if it exists
      if (value) {
        setCustomValue(value);
      } else {
        setCustomValue('');
      }
    } else {
      // Switching back to dropdown - clear value only if it doesn't exist in options
      if (value && !valueExistsInOptions) {
        onChange(''); // Clear custom value that's not in options
      }
      setCustomValue('');
      // Reset manual toggle flag when switching back to dropdown
      manualToggleRef.current = false;
    }
  };

  const handleCustomInputChange = (e) => {
    const newValue = e.target.value;
    setCustomValue(newValue);
    onChange(newValue);
  };

  const handleDropdownChange = (selectedValue) => {
    console.log('aaaa selectedValue', selectedValue);
    // If user selects from dropdown, automatically switch off custom mode
    if (selectedValue && useCustomInput) {
      setUseCustomInput(false);
      setCustomValue('');
      manualToggleRef.current = false; // Reset manual toggle
    }
    onChange(selectedValue);
  };

  useEffect(() => {
    console.log('aaaa useCustomInput', useCustomInput);
  }, [useCustomInput]);

  return (
    <div className={className}>
      {useCustomInput ? (
        <div className="space-y-2">
          <input
            type="text"
            value={customValue}
            onChange={handleCustomInputChange}
            placeholder={customPlaceholder}
            disabled={disabled || loading}
            className={`
              w-full px-3 py-2 border border-gray-300 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-green-500
              ${disabled || loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            `}
            {...props}
          />
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={useCustomInput}
              onChange={handleCheckboxChange}
              disabled={disabled || loading}
              className="accent-green-500"
            />
            <span>{t(customLabel)}</span>
          </label>
        </div>
      ) : (
        <div className="space-y-2">
          <SearchableDropdown
            options={options}
            value={value}
            onChange={handleDropdownChange}
            placeholder={placeholder}
            disabled={disabled}
            loading={loading}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
            {...props}
          />
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={useCustomInput}
              onChange={handleCheckboxChange}
              disabled={disabled || loading}
              className="accent-green-500"
            />
            <span>{t(customLabel)}</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdownWithCustom;