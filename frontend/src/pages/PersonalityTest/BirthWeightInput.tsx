import React, { useEffect, useState } from 'react';

interface BirthWeightInputProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
}

const BirthWeightInput: React.FC<BirthWeightInputProps> = ({
  value,
  onChange,
  language,
  placeholder,
}) => {
  const [weight, setWeight] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  console.log('Unit:', unit);

  // Parse the stored value when component mounts or value changes
  useEffect(() => {
    if (value) {
      // Extract weight and unit from stored format like "3.5kg" or "7lb"
      const match = value.match(/^(\d*\.?\d*)\s*(kg|lb)$/i);
      if (match) {
        setWeight(match[1]);
        setUnit(match[2].toLowerCase());
      } else {
        // If format doesn't match, try to extract just numbers
        const numberMatch = value.match(/(\d*\.?\d*)/);
        if (numberMatch && numberMatch[1]) {
          setWeight(numberMatch[1]);
          // Don't change unit if there's already one selected
        }
      }
    } else if (value === '') {
      // Only reset if explicitly empty, not on initial load
      setWeight('');
      // Don't reset unit automatically - let user keep their selection
    }
  }, [value]);

  // Update the stored value when weight or unit changes
  const updateStoredValue = (newWeight: string, newUnit: string) => {
    const trimmedWeight = newWeight.trim();
    if (trimmedWeight && !isNaN(Number(trimmedWeight)) && newUnit) {
      const formattedValue = `${trimmedWeight}${newUnit}`;
      onChange(formattedValue);
    } else {
      // Clear the stored value if weight is invalid or no unit selected
      onChange('');
    }
  };

  const handleWeightChange = (newWeight: string) => {
    // Allow only numbers and one decimal point
    const sanitized = newWeight.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = sanitized.split('.');
    const finalWeight = parts.length > 2 
      ? parts[0] + '.' + parts.slice(1).join('') 
      : sanitized;
    
    setWeight(finalWeight);
    updateStoredValue(finalWeight, unit);
  };

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit);
    updateStoredValue(weight, newUnit);
  };

  const weightPlaceholder = language === 'en' ? 'Enter weight' : '输入体重';
  const kgLabel = language === 'en' ? 'kg' : '千克';
  const lbLabel = language === 'en' ? 'lb' : '磅';

  return (
    <div className="birth-weight-input-container">
      <div className="weight-input-wrapper">
        <input
          type="text"
          className="weight-number-input"
          value={weight}
          onChange={e => handleWeightChange(e.target.value)}
          placeholder={weightPlaceholder}
          inputMode="decimal"
        />
        <select
          className="weight-unit-select"
          value={unit || ''}
          onChange={e => handleUnitChange(e.target.value)}
        >
          <option value="" disabled>
            {language === 'en' ? 'Select unit' : '选择单位'}
          </option>
          <option value="kg">{kgLabel}</option>
          <option value="lb">{lbLabel}</option>
        </select>
      </div>
    </div>
  );
};

export default BirthWeightInput;
