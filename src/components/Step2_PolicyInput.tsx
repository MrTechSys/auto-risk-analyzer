import { useState } from 'react';
import { useRiskStore } from '../store/useRiskStore';
import { motion } from 'framer-motion';
import { z } from 'zod';
import Tooltip from './ui/Tooltip';

// Schema for this step
const stepSchema = z.object({
  stateCode: z.string().length(2, "Please select a state"),
  effectiveDate: z.string().min(1, "Effective date is required"),
});

export default function Step2_PolicyInput() {
  const { policy, updatePolicy, nextStep, prevStep } = useRiskStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const result = stepSchema.safeParse({
      stateCode: policy.stateCode,
      effectiveDate: policy.effectiveDate,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    nextStep();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="container full-screen flex-center"
      style={{ flexDirection: 'column', maxWidth: '600px', margin: '0 auto' }}
    >
      <h2 style={{ marginBottom: '2rem' }}>Policy <span className="text-gold">Basics</span></h2>

      <div style={{ width: '100%', marginBottom: '1.5rem' }}>
        <label className="label">
          State
          <Tooltip text="Insurance rules and minimums vary significantly by state." />
        </label>
        <select 
          className="input-field"
          style={{ borderColor: errors.stateCode ? 'var(--color-error)' : '' }}
          value={policy.stateCode}
          onChange={(e) => updatePolicy({ stateCode: e.target.value })}
        >
          <option value="">Select State</option>
          <option value="CA">California</option>
          <option value="TX">Texas</option>
          <option value="NY">New York</option>
          <option value="FL">Florida</option>
        </select>
        {errors.stateCode && <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{errors.stateCode}</p>}
      </div>

      <div style={{ width: '100%', marginBottom: '1.5rem' }}>
        <label className="label">Policy Number (Optional)</label>
        <input 
          type="text" 
          className="input-field"
          placeholder="Enter policy number"
          value={policy.policyNumber || ''}
          onChange={(e) => updatePolicy({ policyNumber: e.target.value.trim() })}
        />
      </div>

      <div style={{ width: '100%', marginBottom: '2rem' }}>
        <label className="label">Effective Date</label>
        <input 
          type="date" 
          className="input-field"
          style={{ borderColor: errors.effectiveDate ? 'var(--color-error)' : '' }}
          value={policy.effectiveDate || ''}
          onChange={(e) => updatePolicy({ effectiveDate: e.target.value })}
        />
        {errors.effectiveDate && <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{errors.effectiveDate}</p>}
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={prevStep} className="btn-secondary">Back</button>
        <button onClick={handleNext} className="btn-primary">Next: Drivers & Vehicles</button>
      </div>
    </motion.div>
  );
}
