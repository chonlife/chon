import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import questionnaireApi from '../../api/questionnaire';
import './Login.css';
import '../Signup/AccountSignup.css';
import countries from '../PersonalityTest/country-list.json';

const Login = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(''); // email or local phone input
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const identifierInputRef = useRef<HTMLInputElement | null>(null);

  const hasAt = identifier.includes('@');
  const firstChar = identifier.trim().charAt(0);
  const isPhoneCandidate = !hasAt && (firstChar === '+' || /\d/.test(firstChar));
  const canUseEmail = hasAt && identifier.trim().length > 0;
  const canUsePhone = isPhoneCandidate && identifier.trim().length > 0;

  type CountryItem = { country_code: number; country_name_en: string; country_name_cn: string; ab: string };
  const allCountries = countries as CountryItem[];
  const [phoneCode, setPhoneCode] = useState<string>('+1');
  const codeOptions = useMemo(() => {
    return allCountries
      .filter(c => c.country_code)
      .map(c => ({
        id: `${c.ab || c.country_name_en}-${c.country_code}`,
        value: `+${c.country_code}`,
        label: language === 'en' ? `${c.country_name_en} (+${c.country_code})` : `${c.country_name_cn} (+${c.country_code})`
      }));
  }, [allCountries, language]);

  // Keep focus on the identifier input when switching between email/phone modes
  useLayoutEffect(() => {
    // Ensure the text input holds focus during mode switch so keystrokes go there
    identifierInputRef.current?.focus();
  }, [isPhoneCandidate]);

  const validate = (): string | null => {
    if (!canUseEmail && !canUsePhone) {
      return language === 'en' ? 'Provide email or phone number.' : '请填写邮箱或手机号。';
    }
    if (!password) {
      return language === 'en' ? 'Enter your password.' : '请输入密码。';
    }
    if (canUseEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      return language === 'en' ? 'Invalid email format.' : '邮箱格式不正确。';
    }
    if (canUsePhone) {
      const digits = identifier.replace(/\D/g, '');
      if (digits.length < 4) {
        return language === 'en' ? 'Invalid phone number.' : '手机号格式不正确。';
      }
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
      let payload: any = { password };
      if (canUseEmail) {
        payload.email = identifier.trim();
      } else if (canUsePhone) {
        const trimmed = identifier.trim();
        // If user already typed a leading '+', treat it as full E.164 and ignore picker
        const phone = trimmed.startsWith('+') ? trimmed : `${phoneCode} ${trimmed}`;
        payload.phone_number = phone;
      }
      const loginResp = await questionnaireApi.login(payload);
      if (!loginResp?.success || !loginResp?.user?.user_id) {
        setShowError(language === 'en' ? 'Invalid credentials.' : '账号或密码错误。');
        setSubmitting(false);
        return;
      }

      const userId = loginResp.user.user_id;
      const username = loginResp.user.username;
      // Persist logged in user basics
      localStorage.setItem('chon_user_id', userId);
      localStorage.setItem('chon_username', username || '');

      // Fetch user's questionnaire submissions
      const resp = await questionnaireApi.getUserResponses(userId);
      const submissions = resp?.submissions || [];
      if (submissions.length > 0) {
        // Take the latest submission
        const latest = submissions[0];
        const answersArray = latest.answers || [];
        // Convert to local Storage structure minimally for continuity
        const storedAnswers: Record<number, { value: string | string[] }> = {};
        answersArray.forEach((a: any) => {
          storedAnswers[a.question_id] = { value: a.response_value };
        });
        localStorage.setItem('chon_personality_answers', JSON.stringify(storedAnswers));
        localStorage.setItem('chon_personality_step', 'results');
        // Keep identity if API returns it
        if (latest.questionnaire_type) {
          localStorage.setItem('chon_personality_identity', JSON.stringify(latest.questionnaire_type));
        }
      }

      // Redirect to profile page
      navigate('/profile');
    } catch (err) {
      setShowError(language === 'en' ? 'Login failed. Please try again.' : '登录失败，请重试。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container" lang={language}>
      <div className="molecule-background" />
      <div className="hexagon-pattern" />
      <h1>{language === 'en' ? 'Login' : '登录'}</h1>
      <form className="account-signup-form" onSubmit={handleSubmit}>
        <div className={`field ${isPhoneCandidate ? 'phone-inline' : ''}`}>
          {isPhoneCandidate ? (
            <div className="phone-row">
              <select
                className="country-select-inline"
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value)}
                aria-label={language === 'en' ? 'Country code' : '国家区号'}
              >
                {codeOptions.map(opt => (
                  <option key={opt.id} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder=" "
                autoComplete={'tel'}
                inputMode={'tel'}
                ref={identifierInputRef}
              />
            </div>
          ) : (
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder=" "
              autoComplete={'email'}
              inputMode={'text'}
              ref={identifierInputRef}
            />
          )}
          <label htmlFor="identifier">{language === 'en' ? (isPhoneCandidate ? 'Mobile number' : 'Email or mobile number') : (isPhoneCandidate ? '手机号' : '邮箱或手机号')}</label>
        </div>

        <div className="field">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            autoComplete="current-password"
          />
          <label htmlFor="password">{language === 'en' ? 'Password' : '密码'}</label>
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(s => !s)}
            aria-label={language === 'en' ? (showPassword ? 'Hide password' : 'Show password') : (showPassword ? '隐藏密码' : '显示密码')}
          >
            {showPassword ? 
              <img src={new URL('../../icons/preview-open.svg', import.meta.url).toString()} alt="Preview Open" style={{ width: 18, height: 18, marginRight: 6 }} /> 
              : 
              <img src={new URL('../../icons/preview-close.svg', import.meta.url).toString()} alt="Preview Close" style={{ width: 18, height: 18, marginRight: 6 }} />}
          </button>
        </div>

        {showError && (
          <div className="form-error" role="alert">
            {showError}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? (language === 'en' ? 'Signing in...' : '登录中...') : (language === 'en' ? 'Login' : '登录')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;