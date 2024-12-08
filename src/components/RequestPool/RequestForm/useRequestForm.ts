import { useState, useCallback } from 'react';

interface FormData {
  module_name: string;
  description: string;
  language: string;
  tags: string[];
}

interface FormErrors {
  module_name?: string;
  description?: string;
  language?: string;
  tags?: string;
}

interface UseRequestFormReturn {
  formData: FormData;
  errors: FormErrors;
  isSubmitting: boolean;
  success: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleTagsChange: (tags: string[]) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

const initialFormData: FormData = {
  module_name: '',
  description: '',
  language: 'lt',
  tags: []
};

export const useRequestForm = (onClose: () => void): UseRequestFormReturn => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.module_name.trim()) {
      newErrors.module_name = 'Module name is required';
    } else if (formData.module_name.length < 3) {
      newErrors.module_name = 'Module name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.language) {
      newErrors.language = 'Language is required';
    }

    if (!formData.tags.length) {
      newErrors.tags = 'At least one tag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }, []);

  const handleTagsChange = useCallback((tags: string[]) => {
    setFormData(prev => ({ ...prev, tags }));
    setErrors(prev => ({ ...prev, tags: undefined }));
  }, []);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccess(false);

    try {
      const response = await fetch('https://bos.howkings.eu/api/module-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit request');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: err instanceof Error ? err.message : 'An unexpected error occurred'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setSuccess(false);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    success,
    handleChange,
    handleTagsChange,
    handleSubmit,
    resetForm
  };
};
