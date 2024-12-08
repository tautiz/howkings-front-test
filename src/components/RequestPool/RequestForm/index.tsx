import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import FormField from './FormField';
import StatusMessage from './StatusMessage';
import SubmitButton from './SubmitButton';
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';
import './tagify.css';
import { useRequestForm } from './useRequestForm';

interface RequestFormProps {
  onClose: () => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ onClose }) => {
  const {
    formData,
    errors,
    isSubmitting,
    success,
    handleChange,
    handleTagsChange,
    handleSubmit,
    resetForm
  } = useRequestForm(onClose);

  const tagifyRef = useRef<HTMLInputElement>(null);
  const tagifyInstance = useRef<Tagify | null>(null);

  useEffect(() => {
    if (tagifyRef.current) {
      tagifyInstance.current = new Tagify(tagifyRef.current, {
        whitelist: ['Science', 'Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Economics', 'Psychology', 'Sociology', 'Political Science', 'Anthropology', 'Other'],
        maxTags: 10,
        dropdown: {
          maxItems: 20,
          classname: 'tags-dropdown',
          enabled: 0,
          closeOnSelect: false
        }
      });

      tagifyInstance.current.on('change', e => {
        const tags = JSON.parse(e.detail.value).map((tag: { value: string }) => tag.value);
        handleTagsChange(tags);
      });

      return () => {
        if (tagifyInstance.current) {
          tagifyInstance.current.destroy();
        }
      };
    }
  }, [handleTagsChange]);

  useEffect(() => {
    // Reset form when closing
    return () => resetForm();
  }, [resetForm]);

  const inputClasses = "w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none";
  const errorClasses = "text-red-500 text-sm mt-1";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:opacity-50"
          disabled={isSubmitting}
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">Submit New Request</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <FormField label="Module Name">
              <input
                type="text"
                name="module_name"
                value={formData.module_name}
                onChange={handleChange}
                className={`${inputClasses} ${errors.module_name ? 'border-red-500' : ''}`}
                placeholder="Enter module name"
                required
                disabled={isSubmitting}
              />
              {errors.module_name && (
                <p className={errorClasses}>{errors.module_name}</p>
              )}
            </FormField>

            <FormField label="Description">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`${inputClasses} h-32 ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your module..."
                required
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className={errorClasses}>{errors.description}</p>
              )}
            </FormField>

            <FormField label="Language">
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className={`${inputClasses} ${errors.language ? 'border-red-500' : ''}`}
                required
                disabled={isSubmitting}
              >
                <option value="lt">Lithuanian</option>
                <option value="en">English</option>
              </select>
              {errors.language && (
                <p className={errorClasses}>{errors.language}</p>
              )}
            </FormField>

            <FormField label="Tags">
              <input
                ref={tagifyRef}
                name="tags"
                className={`${inputClasses} ${errors.tags ? 'border-red-500' : ''}`}
                placeholder="Add tags..."
                disabled={isSubmitting}
              />
              {errors.tags && (
                <p className={errorClasses}>{errors.tags}</p>
              )}
            </FormField>
          </div>

          {errors.submit && <StatusMessage type="error" message={errors.submit} />}
          {success && <StatusMessage type="success" message="Request was sent successfully" />}

          <SubmitButton isSubmitting={isSubmitting} isDisabled={false} />
        </form>
      </div>
    </div>
  );
};

export default RequestForm;