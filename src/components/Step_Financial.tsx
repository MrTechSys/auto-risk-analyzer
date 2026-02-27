import { useState } from 'react';
import { useRiskStore } from '../store/useRiskStore';
import { motion } from 'framer-motion';
import { z } from 'zod';
import Tooltip from './ui/Tooltip';

const financialSchema = z.object({
  annualIncomeRange: z.enum(['<50k', '50k-100k', '100k-250k', '250k+']),
  homeOwner: z.boolean(),
  savingsBuffer: z.enum(['<10k', '10k-50k', '50k+']),
});

export default function Step_Financial() {
  const { policy, updateFinancials, nextStep, prevStep } = useRiskStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const result = financialSchema.safeParse(policy.financials);

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
      style={{ flexDirection: 'column', maxWidth: '600px' }}
    >
      <h2 style={{ marginBottom: '1rem' }}>Financial <span className="text-gold">Readiness</span></h2>
      <p className="text-grey" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        This helps us calibrate liability limits to protect your assets.
      </p>

      <div style={{ width: '100%', marginBottom: '1.5rem' }}>
        <label className="label">
          Annual Household Income
          <Tooltip text="Higher income levels require higher liability protection to prevent wage garnishment." />
        </label>
        <select 
          className="input-field"
          style={{ borderColor: errors.annualIncomeRange ? 'var(--color-error)' : '' }}
          value={policy.financials?.annualIncomeRange || ''}
          onChange={(e) => updateFinancials({ annualIncomeRange: e.target.value as '250k+' })}
        >
          <option value="">Select Range</option>
          <option value="<50k">Less than $50,000</option>
          <option value="50k-100k">$50,000 - $100,000</option>
          <option value="100k-250k">$100,000 - $250,000</option>
          <option value="250k+">$250,000 or more</option>
        </select>
        {errors.annualIncomeRange && <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{errors.annualIncomeRange}</p>}
      </div>

      <div style={{ width: '100%', marginBottom: '1.5rem' }}>
        <label className="label">Do you own your home?</label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn-secondary"
            onClick={() => updateFinancials({ homeOwner: true })}
            style={{ flex: 1, borderColor: policy.financials?.homeOwner === true ? 'var(--color-gold)' : '' }}
          >
            Yes
          </button>
          <button 
            className="btn-secondary"
            onClick={() => updateFinancials({ homeOwner: false })}
            style={{ flex: 1, borderColor: policy.financials?.homeOwner === false ? 'var(--color-gold)' : '' }}
          >
            No
          </button>
        </div>
        {errors.homeOwner && <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{errors.homeOwner}</p>}
      </div>

      <div style={{ width: '100%', marginBottom: '2rem' }}>
        <label className="label">Liquid Savings (Buffer)</label>
        <select 
          className="input-field"
          style={{ borderColor: errors.savingsBuffer ? 'var(--color-error)' : '' }}
          value={policy.financials?.savingsBuffer || ''}
          onChange={(e) => updateFinancials({ savingsBuffer: e.target.value as '50k+' })}
        >
          <option value="">Select Savings Buffer</option>
          <option value="<10k">Less than $10,000</option>
          <option value="10k-50k">$10,000 - $50,000</option>
          <option value="50k+">$50,000 or more</option>
        </select>
        {errors.savingsBuffer && <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{errors.savingsBuffer}</p>}
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={prevStep} className="btn-secondary">Back</button>
        <button onClick={handleNext} className="btn-primary">Continue</button>
      </div>
    </motion.div>
  );
}
