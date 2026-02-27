import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, Zap, TrendingUp, Info } from 'lucide-react';
import type { Policy } from '../types';

interface Scenario {
  id: string;
  name: string;
  description: string;
  totalCost: number;
  biCost: number;
  pdCost: number;
  icon: React.ReactNode;
  severity: 'low' | 'medium' | 'high';
}

const SCENARIOS: Scenario[] = [
  {
    id: 'minor',
    name: 'Fender Bender',
    description: 'A low-speed rear-end collision at a stoplight. Minor soft-tissue injury to one person.',
    totalCost: 18000,
    biCost: 12000,
    pdCost: 6000,
    icon: <Zap size={20} />,
    severity: 'low'
  },
  {
    id: 'moderate',
    name: 'Multi-Car Incident',
    description: 'Changing lanes too quickly on a highway. Two cars damaged, one driver needs surgery.',
    totalCost: 95000,
    biCost: 65000,
    pdCost: 30000,
    icon: <TrendingUp size={20} />,
    severity: 'medium'
  },
  {
    id: 'catastrophic',
    name: 'The "Surgeon" Event',
    description: 'A major intersection collision. Totaled luxury EV and severe injuries to a high-earning professional.',
    totalCost: 485000,
    biCost: 400000,
    pdCost: 85000,
    icon: <ShieldAlert size={20} />,
    severity: 'high'
  }
];

interface ScenarioSimulatorProps {
  policy: Policy;
}

export default function ScenarioSimulator({ policy }: ScenarioSimulatorProps) {
  const [activeId, setActiveId] = useState(SCENARIOS[1].id);
  const activeScenario = useMemo(() => SCENARIOS.find(s => s.id === activeId)!, [activeId]);

  // Calculate Exposure
  const calculation = useMemo(() => {
    const biCovered = Math.min(activeScenario.biCost, policy.coverages.bodilyInjuryPerPerson);
    const pdCovered = Math.min(activeScenario.pdCost, policy.coverages.propertyDamage);
    const totalCovered = biCovered + pdCovered;
    const exposure = Math.max(0, activeScenario.totalCost - totalCovered);
    
    return {
      biCovered,
      pdCovered,
      totalCovered,
      exposure,
      isExposed: exposure > 0
    };
  }, [activeScenario, policy]);

  const exposurePercentage = (calculation.exposure / activeScenario.totalCost) * 100;

  return (
    <div className="scenario-simulator" style={{ marginTop: '3rem', padding: '3rem', background: '#080808', border: '1px solid #1a1a1a', borderRadius: '32px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>The "Financial Ruin" <span className="text-gold">Simulator</span></h3>
        <p className="text-grey" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Real-world claims often exceed legal minimums. Select a scenario to see how your current policy handles the fallout.
        </p>
      </div>

      {/* Scenario Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            style={{
              padding: '1.5rem',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: activeId === s.id ? 'var(--color-gold)' : '#222',
              background: activeId === s.id ? 'rgba(212, 175, 55, 0.05)' : '#050505',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left'
            }}
          >
            <div style={{ color: activeId === s.id ? 'var(--color-gold)' : '#444', marginBottom: '1rem' }}>
              {s.icon}
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem', color: activeId === s.id ? 'white' : '#888' }}>
              {s.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666', lineHeight: 1.4 }}>
              ${s.totalCost.toLocaleString()} Estimated Claim
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        {/* Visual Bar */}
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <span className="text-grey">Financial Fallout Split</span>
              <span style={{ fontWeight: 'bold' }}>${activeScenario.totalCost.toLocaleString()}</span>
            </div>
            
            <div style={{ height: '80px', width: '100%', background: '#111', borderRadius: '16px', overflow: 'hidden', display: 'flex', border: '1px solid #222' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${100 - exposurePercentage}%` }}
                transition={{ type: 'spring', damping: 20 }}
                style={{ 
                  background: 'var(--color-gold)', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  paddingLeft: '1.5rem',
                  color: 'black',
                  fontWeight: '900',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase'
                }}
              >
                {100 - exposurePercentage > 20 && 'Insurance Pays'}
              </motion.div>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${exposurePercentage}%` }}
                transition={{ type: 'spring', damping: 20 }}
                style={{ 
                  background: 'var(--color-error)', 
                  height: '100%',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'flex-end',
                  paddingRight: '1.5rem',
                  color: 'white',
                  fontWeight: '900',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase'
                }}
              >
                {exposurePercentage > 20 && 'YOU PAY OUT-OF-POCKET'}
              </motion.div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
              <div className="text-grey" style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Insurance Protection</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-gold)' }}>${calculation.totalCovered.toLocaleString()}</div>
            </div>
            <div style={{ padding: '1.5rem', borderRadius: '16px', background: calculation.isExposed ? 'rgba(239, 68, 68, 0.05)' : 'rgba(34, 197, 94, 0.05)', border: calculation.isExposed ? '1px solid rgba(239, 68, 68, 0.1)' : '1px solid rgba(34, 197, 94, 0.1)' }}>
              <div className="text-grey" style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Personal Exposure</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: calculation.isExposed ? 'var(--color-error)' : '#22c55e' }}>
                ${calculation.exposure.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Narrative / Warning */}
        <div style={{ background: '#050505', padding: '2.5rem', borderRadius: '24px', border: '1px solid #222' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ color: 'var(--color-gold)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                <Info size={14} /> Scenario Intelligence
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                {activeScenario.description}
              </p>

              {calculation.isExposed ? (
                <div style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--color-error)', background: 'rgba(239, 68, 68, 0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-error)', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                    <AlertTriangle size={20} /> LIQUIDATION RISK
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa', lineHeight: 1.5 }}>
                    Your current limits are exhausted in this scenario. Under Texas law, your wages could be garnished or assets seized to pay the remaining <strong>${calculation.exposure.toLocaleString()}</strong>.
                  </p>
                </div>
              ) : (
                <div style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid #22c55e', background: 'rgba(34, 197, 94, 0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#22c55e', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                    <ShieldAlert size={20} /> FULLY INSULATED
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa', lineHeight: 1.5 }}>
                    Your current limits are sufficient to cover this entire event. You have effectively transferred 100% of this financial risk to the insurer.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
