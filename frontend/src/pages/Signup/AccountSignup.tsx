import React, { useEffect, useMemo, useState } from 'react';
import questionnaireApi from '../../api/questionnaire';
import { StoredAnswer } from '../PersonalityTest/PersonalityTest';
import countries from '../PersonalityTest/country-list.json';
import { getUserId } from '../../utils/userIdentification';
import './AccountSignup.css';

interface AccountSignupProps {
  language: string;
  answers: Record<number, StoredAnswer>;
  onCancel?: () => void;
  onSuccess?: () => void;
}

interface CountryItem {
  country_code: number;
  country_name_en: string;
  country_name_cn: string;
  ab: string;
}

const AccountSignup: React.FC<AccountSignupProps> = ({ language, answers, onCancel, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const allCountries = countries as CountryItem[];

  // Prefill email from question 6 if answered
  useEffect(() => {
    const q6 = answers[6]?.value;
    if (typeof q6 === 'string' && q6.includes('@')) {
      setEmail(q6);
    }
  }, [answers]);

  // Prefill country code from question 3 (country), default to US if not found
  useEffect(() => {
    const q3 = answers[3]?.value;
    if (typeof q3 === 'string' && q3.trim().length > 0) {
      const lower = q3.toLowerCase();
      const found = allCountries.find(c => (c.country_name_en || '').toLowerCase() === lower || (c.country_name_cn || '') === q3);
      if (found) {
        setPhoneCode(`+${found.country_code}`);
        return;
      }
    }
    // Default
    setPhoneCode('+1');
  }, [answers, allCountries]);

  const codeOptions = useMemo(() => {
    return allCountries
      .filter(c => c.country_code)
      .map(c => ({
        value: `+${c.country_code}`,
        label: language === 'en' ? `${c.country_name_en} (+${c.country_code})` : `${c.country_name_cn} (+${c.country_code})`
      }));
  }, [allCountries, language]);

  const validate = (): string | null => {
    const hasEmail = email.trim().length > 0;
    const hasPhone = phoneNumber.trim().length > 0;
    if (!hasEmail && !hasPhone) {
      return language === 'en' ? 'Provide at least email or phone number.' : '请至少填写邮箱或手机号。';
    }
    if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return language === 'en' ? 'Invalid email format.' : '邮箱格式不正确。';
    }
    if (hasPhone && !/^\d{4,}$/.test(phoneNumber.replace(/\D/g, ''))) {
      return language === 'en' ? 'Invalid phone number.' : '手机号格式不正确。';
    }
    if (username.trim().length < 2) {
      return language === 'en' ? 'Username must be at least 2 characters.' : '用户名至少2个字符。';
    }
    if (password.length < 6) {
      return language === 'en' ? 'Password must be at least 6 characters.' : '密码至少6个字符。';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setShowError(error);
      return;
    }
    setShowError(null);
    setSubmitting(true);
    try {
      const user_id = getUserId();
      const ok = await questionnaireApi.createAccount({
        user_id,
        email: email || undefined,
        phone_number: (phoneNumber ? `${phoneCode} ${phoneNumber}` : undefined),
        username,
        password
      });
      if (ok) {
        onSuccess && onSuccess();
      } else {
        setShowError(language === 'en' ? 'Failed to create account.' : '创建账户失败。');
      }
    } catch (err) {
      setShowError(language === 'en' ? 'Failed to create account.' : '创建账户失败。');
    } finally {
      setSubmitting(false);
    }
  };

  const phoneFieldClass = `field field--split ${phoneNumber.trim() ? 'is-filled' : ''}`;

  return (
    <div className="account-signup-container" lang={language}>
      <h1 className="signup-title">{language === 'en' ? 'Create Your Account' : '创建您的账户'}</h1>
      <form className="account-signup-form" onSubmit={handleSubmit}>
        {/* Username */}
        <div className="field">
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder=" "
            required
            autoComplete="username"
          />
          <label htmlFor="username">{language === 'en' ? 'Username *' : '用户名 *'}</label>
        </div>

        {/* Password with toggle */}
        <div className="field">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            required
            autoComplete="new-password"
          />
          <label htmlFor="password">{language === 'en' ? 'Password *' : '密码 *'}</label>
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(s => !s)}
            aria-label={language === 'en' ? (showPassword ? 'Hide password' : 'Show password') : (showPassword ? '隐藏密码' : '显示密码')}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Email */}
        <div className="field">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            autoComplete="email"
          />
          <label htmlFor="email">{language === 'en' ? 'Email (optional)' : '邮箱（可选）'}</label>
        </div>

        {/* Phone */}
        <div className={phoneFieldClass}>
          <label>{language === 'en' ? 'Phone (optional)' : '手机号（可选）'}</label>
          <div className="split">
            <select value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)}>
              {codeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder=" "
              autoComplete="tel"
            />
          </div>
        </div>

        {showError && (
          <div className="form-error" role="alert">
            {showError}
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onCancel} disabled={submitting}>
            {language === 'en' ? 'Back' : '返回'}
          </button>
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? (language === 'en' ? 'Creating...' : '创建中...') : (language === 'en' ? 'Create Account' : '创建账户')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSignup;


