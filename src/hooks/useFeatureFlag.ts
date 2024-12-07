import { useState, useEffect } from 'react';

export const useFeatureFlag = (flag: string): boolean => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const value = import.meta.env[`VITE_${flag}`];
    setIsEnabled(value === 'true');
  }, [flag]);

  return isEnabled;
};