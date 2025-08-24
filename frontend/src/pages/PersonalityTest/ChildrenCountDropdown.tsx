import React, { useEffect, useMemo, useRef, useState } from 'react';

interface ChildrenCountDropdownProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
}

const ChildrenCountDropdown: React.FC<ChildrenCountDropdownProps> = ({
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

  // Options for children count: 1, 2, 3, ..., 10, 10+
  const options = useMemo(() => {
    const numbers = Array.from({ length: 10 }, (_, i) => String(i + 1));
    return [...numbers, '10+'];
  }, []);

  const filteredOptions = useMemo(() => {
    const query = inputValue.trim();
    if (!query) return options;
    
    // Filter options that start with the input or match exactly
    return options.filter(option => 
      option.startsWith(query) || option === query
    );
  }, [options, inputValue]);

  // Check if the input exactly matches one of our valid options
  const isValidOption = (query: string): boolean => {
    return options.includes(query.trim());
  };

  const handleInputChange = (next: string) => {
    setInputValue(next);
    setIsOpen(true);
    
    // Only commit answer if it's a valid option
    if (isValidOption(next)) {
      onChange(next.trim());
      setIsOpen(false);
    } else {
      // Clear the stored answer if input doesn't match valid options
      onChange('');
    }
  };

  const handleSelectOption = (option: string) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  // If input loses focus without a valid selection, revert to last valid value
  const handleBlur = () => {
    if (!isValidOption(inputValue)) {
      setInputValue(value || '');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredOptions.length === 1) {
      handleSelectOption(filteredOptions[0]);
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' && !isOpen) {
      setIsOpen(true);
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
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="autocomplete-list" role="listbox">
          {filteredOptions.map((option) => (
            <li
              key={option}
              className="autocomplete-item"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelectOption(option)}
              role="option"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChildrenCountDropdown;
