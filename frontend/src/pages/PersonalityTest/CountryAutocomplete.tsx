import React, { useEffect, useMemo, useRef, useState } from 'react';
import countries from './country-list.json';

interface CountryItem {
  country_code: number;
  country_name_en: string;
  country_name_cn: string;
  ab: string;
}

interface CountryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
}

const CountryAutocomplete: React.FC<CountryAutocompleteProps> = ({
  value,
  onChange,
  language,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState<string>(value || '');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allCountries = countries as CountryItem[];

  const filteredCountries = useMemo(() => {
    const query = inputValue.trim();
    if (!query) return allCountries;
    if (language === 'en') {
      const lower = query.toLowerCase();
      return allCountries.filter(c => (c.country_name_en || '').toLowerCase().includes(lower)).slice(0, 10);
    }
    return allCountries.filter(c => (c.country_name_cn || '').includes(query)).slice(0, 10);
  }, [allCountries, inputValue, language]);

  // Find an exact match against the list based on current language
  const findExactMatch = (query: string): CountryItem | undefined => {
    const trimmed = query.trim();
    if (!trimmed) return undefined;
    if (language === 'en') {
      const lower = trimmed.toLowerCase();
      return allCountries.find(c => (c.country_name_en || '').toLowerCase() === lower);
    }
    return allCountries.find(c => (c.country_name_cn || '') === trimmed);
  };

  const handleInputChange = (next: string) => {
    setInputValue(next);
    setIsOpen(true);
    // Only commit answer if exact match, otherwise clear stored answer
    const exact = findExactMatch(next);
    if (exact) {
      const display = language === 'en' ? exact.country_name_en : exact.country_name_cn;
      onChange(display);
      // Optionally close the list when exact typed
      setIsOpen(false);
    } else {
      onChange('');
    }
  };

  const handleSelectCountry = (country: CountryItem) => {
    const display = language === 'en' ? country.country_name_en : country.country_name_cn;
    setInputValue(display);
    onChange(display);
    setIsOpen(false);
  };

  // If input loses focus without a valid selection, revert to last valid value (which is in `value` prop)
  const handleBlur = () => {
    const exact = findExactMatch(inputValue);
    if (!exact) {
      setInputValue(value || '');
    }
  };

  return (
    <div className="text-input-container autocomplete-wrapper" ref={containerRef}>
      <input
        type="text"
        className="text-answer-input"
        value={inputValue}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        onChange={e => handleInputChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
      />
      {isOpen && filteredCountries.length > 0 && (
        <ul className="autocomplete-list" role="listbox">
          {filteredCountries.map((c) => (
            <li
              key={`${c.ab}-${c.country_code}`}
              className="autocomplete-item"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelectCountry(c)}
              role="option"
            >
              {language === 'en' ? c.country_name_en : c.country_name_cn}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountryAutocomplete;


