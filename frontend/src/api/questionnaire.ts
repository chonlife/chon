import axios from 'axios';
import { questions } from '../pages/PersonalityTest/questionnaires';
import { getUserId } from '../utils/userIdentification';
import { StoredAnswer } from '../pages/PersonalityTest/PersonalityTest';
import { CorporateRole } from '../pages/PersonalityTest/IdentitySelection';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// 问卷类型定义
export type QuestionnaireType = 'mother' | 'corporate' | 'other' | 'both';
export type QuestionType = 'multiple-choice' | 'text-input' | 'scale-question';

// 回答格式定义
export interface QuestionResponse {
  question_id: number;
  response_value: string;
}

export interface QuestionnaireSubmission {
  user_id: string;
  type: QuestionnaireType;
  corporate_role?: CorporateRole;  // Optional field for corporate role
  answers: QuestionResponse[];
}

export interface SignupPayload {
  user_id: string;
  email?: string | null;
  phone_number?: string | null;
  password: string;
  username: string;
}

export interface LoginPayload {
  email?: string | null;
  phone_number?: string | null;
  password: string;
}

/**
 * Save user's intro choice to backend
 * @param choice user's choice, yes or no
 * @returns Promise indicating success or failure
 */
export const saveIntroChoice = async (choice: string): Promise<boolean> => {
  const userId = getUserId();
  try {
    const response = await axios.post(`${API_URL}/api/intro-choice`, {
      user_id: userId,
      choice: choice
    });
    
    if (response.data.success) {
      console.log(`Successfully saved intro choice '${choice}' for user ${userId}`);
      return true;
    } else {
      console.warn('Intro choice saved but server reported an issue:', response.data);
      return false;
    }
  } catch (error) {
    console.error('Error saving intro choice to backend:', error);
    return false;
  }
};

/**
 * Check if the user already has any questionnaire submissions saved
 */
export const hasSavedSubmission = async (userId: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/api/user-responses/${userId}`);
    const submissions = response?.data?.submissions;
    return Array.isArray(submissions) && submissions.length > 0;
  } catch (error) {
    console.error('Error checking existing submissions:', error);
    return false;
  }
};

/**
 * Login by email or phone_number and password
 */
export const login = async (payload: LoginPayload): Promise<{ success: boolean; user?: { user_id: string; username: string } } > => {
  try {
    const response = await axios.post(`${API_URL}/api/login`, payload);
    return response.data;
  } catch (error) {
    return { success: false } as any;
  }
};

/**
 * Fetch user's responses
 */
export const getUserResponses = async (userId: string) => {
  const response = await axios.get(`${API_URL}/api/user-responses/${userId}`);
  return response.data;
};

/**
 * 批量保存所有问卷回答到后端
 * @param answers 用户的回答记录
 * @param questionnaireType 问卷类型
 * @param corporateRole 企业管理人员的职位（可选）
 * @returns Promise，表示保存操作的结果
 */
export const saveAllQuestionResponses = async (
  answers: Record<number, StoredAnswer>,
  questionnaireType: QuestionnaireType,
  corporateRole?: CorporateRole | null
): Promise<boolean> => {
  if (!answers || Object.keys(answers).length === 0) {
    console.warn('No responses to save');
    return false;
  }

  try {
    const userId = getUserId();
    const submission: QuestionnaireSubmission = {
      user_id: userId,
      type: questionnaireType,
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        question_id: parseInt(questionId),
        response_value: Array.isArray(answer.value) ? JSON.stringify(answer.value) : (answer.value as string)
      }))
    };

    // Add corporate role to submission if provided (backend will accept when present)
    if (corporateRole) {
      submission.corporate_role = corporateRole;
    }

    console.log(`Saving responses for user ${userId} to the backend...`);
    
    await axios.post(`${API_URL}/api/batch-question-responses`, submission);
    
    console.log('Successfully saved all responses to backend');
    return true;
  } catch (error) {
    console.error('Error saving responses to backend:', error);
    return false;
  }
};

export const createAccount = async (payload: Omit<SignupPayload, 'user_id'> & { user_id?: string }): Promise<boolean> => {
  try {
    const userId = payload.user_id || getUserId();
    const body: SignupPayload = {
      user_id: userId,
      email: payload.email ?? null,
      phone_number: payload.phone_number ?? null,
      password: payload.password,
      username: payload.username,
    };
    await axios.post(`${API_URL}/api/signup`, body);
    return true;
  } catch (error) {
    console.error('Error creating account:', error);
    return false;
  }
};

export default {
  saveIntroChoice,
  hasSavedSubmission,
  saveAllQuestionResponses,
  createAccount,
  login,
  getUserResponses
}; 