export const getUserId = (): string => {
  let userId = localStorage.getItem('chon_user_id');
  
  if (!userId) {
    // Generate new ID with timestamp prefix for easy sorting/tracking
    userId = `chon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chon_user_id', userId);
  }
  
  return userId;
}; 