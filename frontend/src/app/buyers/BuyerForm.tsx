'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockApi } from '@/lib/mockApi';
import { BuyerCreateType } from '@/lib/zod-schemas';
import LoadingButton from '@/components/LoadingButton';
import { BuyerCreate, City, PropertyType, BHK, Purpose, Timeline, Source, Status } from '@/lib/zod-schemas';
import { useToast } from '@/contexts/ToastContext';

interface BuyerFormProps {
  initialData?: Partial<BuyerCreateType>;
  isEdit?: boolean;
  buyerId?: string;
}

export default function BuyerForm({ buyer }: { buyer?: any }) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const isEdit = !!buyer;
  const buyerId = buyer?.id;
  const [formData, setFormData] = useState<Partial<BuyerCreateType>>({
    fullName: '',
    email: '',
    phone: '',
    city: 'Chandigarh',
    propertyType: 'Apartment',
    bhk: '3',
    purpose: 'Buy',
    budgetMin: undefined,
    budgetMax: undefined,
    timeline: '0-3m',
    source: 'Website',
    status: 'New',
    tags: [],
    notes: '',
    ...buyer,
  });
  
  // Set default BHK for Apartment/Villa
  useEffect(() => {
    if (['Apartment', 'Villa'].includes(formData.propertyType || '') && !formData.bhk) {
      setFormData(prev => ({ ...prev, bhk: '3' }));
    }
  }, [formData.propertyType]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const validateForm = () => {
    try {
      const validationData = {
        ...formData,
        budgetMin: formData.budgetMin ? Number(formData.budgetMin) : undefined,
        budgetMax: formData.budgetMax ? Number(formData.budgetMax) : undefined,
      };
      BuyerCreate.parse(validationData);
      setErrors({});
      return true;
    } catch (error: any) {
      console.log('Validation errors:', error.errors);
      const newErrors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        const path = err.path.join('.');
        newErrors[path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Form validation passed, creating buyer...');
    setIsSubmitting(true);
    try {
      if (isEdit && buyerId) {
        await mockApi.updateBuyer(buyerId, {
          ...formData as BuyerCreateType,
          id: buyerId,
          updatedAt: new Date().toISOString(),
        });
      } else {
        const validationData = {
          ...formData,
          email: formData.email || undefined,
          notes: formData.notes || undefined,
          budgetMin: formData.budgetMin ? Number(formData.budgetMin) : undefined,
          budgetMax: formData.budgetMax ? Number(formData.budgetMax) : undefined,
        };
        
        console.log('Creating buyer with data:', validationData);
        const newBuyer = await mockApi.createBuyer(validationData as BuyerCreateType);
        console.log('Buyer created successfully:', newBuyer);
        
        // Show professional success toast
        showSuccess(
          'Buyer Created Successfully!',
          `${validationData.fullName} has been added to your buyers database.`
        );
        
        // Clear form after successful creation
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          city: 'Chandigarh',
          propertyType: 'Apartment',
          bhk: '3',
          purpose: 'Buy',
          budgetMin: undefined,
          budgetMax: undefined,
          timeline: '0-3m',
          source: 'Website',
          status: 'New',
          tags: [],
          notes: '',
        });
        setTagInput('');
        
        // Force a small delay to ensure localStorage is updated
        setTimeout(() => {
          router.push('/buyers');
        }, 100);
      }
      
      // For edit mode, also redirect
      if (isEdit) {
        router.push('/buyers');
      }
    } catch (error: any) {
      console.error('Error saving buyer:', error);
      if (error.message.includes('CONFLICT')) {
        setErrors({ general: error.message });
        showError('Update Conflict', error.message);
      } else {
        setErrors({ general: 'An error occurred while saving the buyer.' });
        showError('Save Failed', 'An error occurred while saving the buyer. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BuyerCreateType, value: any) => {
    setFormData((prev: Partial<BuyerCreateType>) => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field as string]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [field as string]: '' }));
    }

    // Handle BHK requirement logic
    if (field === 'propertyType') {
      if (!['Apartment', 'Villa'].includes(value)) {
        setFormData((prev: Partial<BuyerCreateType>) => ({ ...prev, bhk: undefined }));
      }
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      const newTags = [...(formData.tags || []), tagInput.trim()];
      handleInputChange('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = formData.tags?.filter(tag => tag !== tagToRemove) || [];
    handleInputChange('tags', newTags);
  };

  const requiresBHK = ['Apartment', 'Villa'].includes(formData.propertyType || '');

  return (
    <div className="min-h-screen transition-colors duration-300" style={{
        background: 'var(--background)',
        backgroundImage: 'linear-gradient(135deg, var(--background) 0%, var(--background-secondary) 50%, var(--surface) 100%)'
      }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="glass-card rounded-2xl p-12">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold gradient-text mb-4">
                {isEdit ? 'Edit Buyer Lead' : 'Add New Buyer Lead'}
              </h1>
              <p className="text-secondary text-lg max-w-2xl mx-auto">
                {isEdit ? 'Update buyer information and preferences with our comprehensive form' : 'Capture comprehensive buyer details and requirements to build your lead database'}
              </p>
            </div>
            {errors.general && (
              <div className="mb-8 rounded-2xl bg-red-500/10 border border-red-500/20 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span className="text-red-400 text-sm font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-400">Error</h3>
                    <div className="mt-1 text-red-300">
                      {errors.general}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Full Name */}
              <div className="lg:col-span-1">
                <label htmlFor="fullName" className="block text-sm font-semibold text-primary mb-3">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter full name"
                  className={`premium-input ${
                    errors.fullName ? 'border-red-500/50 bg-red-500/5' : ''
                  }`}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                />
                {errors.fullName && (
                  <p id="fullName-error" className="mt-2 text-sm text-red-400">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="lg:col-span-1">
                <label htmlFor="email" className="block text-sm font-semibold text-primary mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className={`premium-input ${
                    errors.email ? 'border-red-500/50 bg-red-500/5' : ''
                  }`}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="lg:col-span-1">
                <label htmlFor="phone" className="block text-sm font-semibold text-primary mb-3">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className={`premium-input ${
                    errors.phone ? 'border-red-500/50 bg-red-500/5' : ''
                  }`}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="mt-2 text-sm text-red-400">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* City */}
              <div className="lg:col-span-1">
                <label htmlFor="city" className="block text-sm font-semibold text-primary mb-3">
                  City *
                </label>
                <select
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="premium-select"
                >
                  {City.options.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div className="lg:col-span-1">
                <label htmlFor="propertyType" className="block text-sm font-semibold text-primary mb-3">
                  Property Type *
                </label>
                <select
                  id="propertyType"
                  value={formData.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  className="premium-select"
                >
                  {PropertyType.options.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* BHK - Conditional */}
              {requiresBHK && (
                <div className="lg:col-span-1">
                  <label htmlFor="bhk" className="block text-sm font-semibold text-primary mb-3">
                    BHK Configuration *
                  </label>
                  <select
                    id="bhk"
                    value={formData.bhk || ''}
                    onChange={(e) => handleInputChange('bhk', e.target.value)}
                    className={`premium-select ${
                      errors.bhk ? 'border-red-500/50 bg-red-500/5' : ''
                    }`}
                    aria-describedby={errors.bhk ? 'bhk-error' : undefined}
                  >
                    <option value="">Select BHK</option>
                    {BHK.options.map((bhk) => (
                      <option key={bhk} value={bhk}>
                        {bhk}
                      </option>
                    ))}
                  </select>
                  {errors.bhk && (
                    <p id="bhk-error" className="mt-2 text-sm text-red-400">
                      {errors.bhk}
                    </p>
                  )}
                </div>
              )}

              {/* Purpose */}
              <div className="lg:col-span-1">
                <label htmlFor="purpose" className="block text-sm font-semibold text-primary mb-3">
                  Purpose *
                </label>
                <select
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  className="premium-select"
                >
                  {Purpose.options.map((purpose) => (
                    <option key={purpose} value={purpose}>
                      {purpose}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Range */}
              <div className="lg:col-span-1">
                <label htmlFor="budgetMin" className="block text-sm font-semibold text-primary mb-3">
                  Budget Min (₹)
                </label>
                <input
                  type="number"
                  id="budgetMin"
                  value={formData.budgetMin || ''}
                  onChange={(e) => handleInputChange('budgetMin', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Minimum budget"
                  className={`premium-input ${
                    errors.budgetMin ? 'border-red-500/50 bg-red-500/5' : ''
                  }`}
                  aria-describedby={errors.budgetMin ? 'budgetMin-error' : undefined}
                />
                {errors.budgetMin && (
                  <p id="budgetMin-error" className="mt-2 text-sm text-red-400">
                    {errors.budgetMin}
                  </p>
                )}
              </div>

              <div className="lg:col-span-1">
                <label htmlFor="budgetMax" className="block text-sm font-semibold text-primary mb-3">
                  Budget Max (₹)
                </label>
                <input
                  type="number"
                  id="budgetMax"
                  value={formData.budgetMax || ''}
                  onChange={(e) => handleInputChange('budgetMax', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Maximum budget"
                  className={`premium-input ${
                    errors.budgetMax ? 'border-red-500/50 bg-red-500/5' : ''
                  }`}
                  aria-describedby={errors.budgetMax ? 'budgetMax-error' : undefined}
                />
                {errors.budgetMax && (
                  <p id="budgetMax-error" className="mt-2 text-sm text-red-400">
                    {errors.budgetMax}
                  </p>
                )}
              </div>

              {/* Timeline */}
              <div className="lg:col-span-1">
                <label htmlFor="timeline" className="block text-sm font-semibold text-primary mb-3">
                  Timeline *
                </label>
                <select
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className="premium-select"
                >
                  {Timeline.options.map((timeline) => (
                    <option key={timeline} value={timeline}>
                      {timeline}
                    </option>
                  ))}
                </select>
              </div>

              {/* Source */}
              <div className="lg:col-span-1">
                <label htmlFor="source" className="block text-sm font-semibold text-primary mb-3">
                  Lead Source *
                </label>
                <select
                  id="source"
                  value={formData.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  className="premium-select"
                >
                  {Source.options.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status - Only for edit */}
              {isEdit && (
                <div className="lg:col-span-1">
                  <label htmlFor="status" className="block text-sm font-semibold text-primary mb-3">
                    Lead Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="premium-select"
                  >
                    {Status.options.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="lg:col-span-3 mt-8">
              <label htmlFor="notes" className="block text-sm font-semibold text-primary mb-3">
                Additional Notes
              </label>
              <textarea
                id="notes"
                rows={4}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any additional notes or requirements..."
                className={`premium-input min-h-[120px] resize-none ${
                  errors.notes ? 'border-red-500/50 bg-red-500/5' : ''
                }`}
                aria-describedby={errors.notes ? 'notes-error' : undefined}
              />
              {errors.notes && (
                <p id="notes-error" className="mt-2 text-sm text-red-400">
                  {errors.notes}
                </p>
              )}
            </div>

            {/* Tags */}
            <div className="lg:col-span-3 mt-8">
              <label htmlFor="tags" className="block text-sm font-semibold text-primary mb-3">
                Tags & Labels
              </label>
              <div className="mb-4">
                <div className="flex flex-wrap gap-3 mb-4">
                  {formData.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium border border-primary/30"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="w-4 h-4 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center transition-colors"
                      >
                        <span className="text-xs">×</span>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a tag..."
                    className="premium-input flex-1"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="btn-secondary px-6 py-3"
                  >
                    Add Tag
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center gap-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary px-8 py-4"
            >
              Cancel
            </button>
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              variant="primary"
              size="lg"
              className="px-8 py-4"
            >
              {isEdit ? 'Update Buyer' : 'Create Buyer'}
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}
