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
  const [effectiveAnswers, setEffectiveAnswers] = useState<Record<number, StoredAnswer>>({});

  const allCountries = countries as CountryItem[];

  // Resolve answers: prefer prop; fallback to localStorage
  useEffect(() => {
    const hasPropAnswers = answers && Object.keys(answers).length > 0;
    if (hasPropAnswers) {
      setEffectiveAnswers(answers);
      return;
    }
    try {
      const saved = localStorage.getItem('chon_personality_answers');
      if (saved) {
        const parsed = JSON.parse(saved) as Record<number, StoredAnswer>;
        setEffectiveAnswers(parsed || {});
      }
    } catch (_) {
      setEffectiveAnswers({});
    }
  }, [answers]);

  // Prefill email from question id 6 if answered
  useEffect(() => {
    const q6 = effectiveAnswers[6]?.value;
    if (typeof q6 === 'string' && q6.includes('@')) {
      setEmail(q6);
    }
  }, [effectiveAnswers]);

  // Prefill country code from question id 3 (country), default to US if not found
  useEffect(() => {
    const q3 = effectiveAnswers[3]?.value;
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
  }, [effectiveAnswers, allCountries]);

  const codeOptions = useMemo(() => {
    return allCountries
      .filter(c => c.country_code)
      .map(c => ({
        id: `${c.ab || c.country_name_en}-${c.country_code}`,
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
    // Password rules: min 10 chars, must include letters and numbers
    const minLen = 10;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (password.length < minLen) {
      return language === 'en'
        ? `Password must be at least ${minLen} characters.`
        : `密码至少${minLen}个字符。`;
    }
    if (!(hasLetter && hasNumber)) {
      return language === 'en'
        ? 'Password must include both letters and numbers.'
        : '密码需包含字母和数字。';
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
      <h1 className="signup-title">{language === 'en' ? 'Save Results & Create Your Account' : '保存结果并创建您的账户'}</h1>
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
                <option key={opt.id} value={opt.value}>{opt.label}</option>
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
            {submitting ? (language === 'en' ? 'Creating...' : '创建中...') : (language === 'en' ? 'Save & Create Account' : '保存并创建账户')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSignup;


