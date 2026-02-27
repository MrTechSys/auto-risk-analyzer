import { useState } from 'react';
import { useRiskStore } from '../store/useRiskStore';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { ShieldCheck, Zap, Info, Star, Trash2, Plus } from 'lucide-react';
import { decodeVIN, type VINIntel } from '../utils/vinDecoder';

const driverSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  age: z.number().min(16, "Driver must be 16+").max(110, "Invalid age"),
});

const vehicleSchema = z.object({
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  vin: z.string().length(17, "VIN must be 17 characters").optional().or(z.literal('')),
});

export default function Step3_VehiclesDrivers() {
  const { policy, addDriver, removeDriver, addVehicle, removeVehicle, nextStep, prevStep } = useRiskStore();
  
  const [driverName, setDriverName] = useState('');
  const [driverAge, setDriverAge] = useState('');
  
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleVIN, setVehicleVIN] = useState('');
  const [vinIntel, setVinIntel] = useState<VINIntel | null>(null);

  const [errors, setErrors] = useState<string | null>(null);

  const handleVINChange = (val: string) => {
    setVehicleVIN(val.toUpperCase());
    if (val.length >= 4) {
      const intel = decodeVIN(val);
      if (intel) {
        setVinIntel(intel);
        setVehicleMake(intel.make);
        setVehicleModel(intel.model);
        setVehicleYear(intel.year.toString());
      }
    } else {
      setVinIntel(null);
    }
  };

  const handleAddDriver = () => {
    const result = driverSchema.safeParse({ name: driverName, age: parseInt(driverAge) });
    if (!result.success) {
      alert(result.error.issues[0].message);
      return;
    }
    addDriver({
      id: Math.random().toString(36).substr(2, 9),
      firstName: driverName.split(' ')[0],
      lastName: driverName.split(' ')[1] || '',
      age: parseInt(driverAge),
      licenseState: policy.stateCode,
    });
    setDriverName('');
    setDriverAge('');
  };

  const handleAddVehicle = () => {
    const result = vehicleSchema.safeParse({ 
      year: parseInt(vehicleYear), 
      make: vehicleMake, 
      model: vehicleModel,
      vin: vehicleVIN 
    });
    if (!result.success) {
      alert(result.error.issues[0].message);
      return;
    }
    addVehicle({
      id: Math.random().toString(36).substr(2, 9),
      year: parseInt(vehicleYear),
      make: vehicleMake,
      model: vehicleModel,
      vin: vehicleVIN,
    });
    setVehicleMake('');
    setVehicleModel('');
    setVehicleYear('');
    setVehicleVIN('');
    setVinIntel(null);
  };

  const handleNext = () => {
    if (policy.drivers.length === 0) {
      setErrors("At least one driver is required.");
      return;
    }
    if (policy.vehicles.length === 0) {
      setErrors("At least one vehicle is required.");
      return;
    }
    setErrors(null);
    nextStep();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="container full-screen"
      style={{ padding: '4rem 0' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Drivers & <span className="text-gold">Vehicles</span></h2>
        <p className="text-grey">List all individuals and vehicles to be covered under this policy.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '3rem', width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Drivers Section */}
        <div style={{ background: '#080808', padding: '2.5rem', borderRadius: '24px', border: '1px solid #111' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
            <Zap size={20} className="text-gold" />
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Rated Drivers</h3>
          </div>

          <div style={{ marginBottom: '2rem', minHeight: '100px' }}>
            <AnimatePresence>
              {policy.drivers.map(d => (
                <motion.div 
                  key={d.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: '#0a0a0a', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #1a1a1a' }}
                >
                  <span style={{ fontWeight: '500' }}>{d.firstName} {d.lastName} <span style={{ color: '#555', marginLeft: '8px' }}>• Age {d.age}</span></span>
                  <button onClick={() => removeDriver(d.id)} style={{ color: '#444', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {policy.drivers.length === 0 && <p className="text-grey" style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '2rem' }}>No drivers added yet.</p>}
          </div>

          <div style={{ background: '#050505', padding: '1.5rem', borderRadius: '16px', border: '1px solid #111' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <input placeholder="Full Name" className="input-field" style={{ flex: 3 }} value={driverName} onChange={e => setDriverName(e.target.value)} />
              <input placeholder="Age" type="number" className="input-field" style={{ flex: 1 }} value={driverAge} onChange={e => setDriverAge(e.target.value)} />
            </div>
            <button onClick={handleAddDriver} className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Plus size={16} /> Add Driver
            </button>
          </div>
        </div>

        {/* Vehicles Section */}
        <div style={{ background: '#080808', padding: '2.5rem', borderRadius: '24px', border: '1px solid #111' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
            <ShieldCheck size={20} className="text-gold" />
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Covered Vehicles</h3>
          </div>

          <div style={{ marginBottom: '2rem', minHeight: '100px' }}>
            <AnimatePresence>
              {policy.vehicles.map(v => (
                <motion.div 
                  key={v.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: '#0a0a0a', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #1a1a1a' }}
                >
                  <div>
                    <div style={{ fontWeight: '500' }}>{v.year} {v.make} {v.model}</div>
                    {v.vin && <div style={{ fontSize: '0.7rem', color: '#444', marginTop: '4px' }}>VIN: {v.vin}</div>}
                  </div>
                  <button onClick={() => removeVehicle(v.id)} style={{ color: '#444', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {policy.vehicles.length === 0 && <p className="text-grey" style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '2rem' }}>No vehicles added yet.</p>}
          </div>

          <div style={{ background: '#050505', padding: '1.5rem', borderRadius: '16px', border: '1px solid #111' }}>
            <input 
              placeholder="Enter 17-digit VIN for Auto-Intel" 
              className="input-field" 
              style={{ width: '100%', marginBottom: '1rem', border: vehicleVIN.length === 17 ? '1px solid var(--color-gold)' : '' }} 
              value={vehicleVIN} 
              maxLength={17}
              onChange={e => handleVINChange(e.target.value)} 
            />

            <AnimatePresence>
              {vinIntel && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ background: 'rgba(212, 175, 55, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.2)', marginBottom: '1rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-gold)', textTransform: 'uppercase' }}>VIN Intelligence Detected</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill={i < vinIntel.safetyRating ? 'var(--color-gold)' : 'none'} color={i < vinIntel.safetyRating ? 'var(--color-gold)' : '#333'} />
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{vinIntel.year} {vinIntel.make} {vinIntel.model}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {vinIntel.adasFeatures.slice(0, 2).map(f => (
                      <span key={f} style={{ fontSize: '0.65rem', background: '#000', padding: '2px 8px', borderRadius: '4px', color: '#888' }}>{f}</span>
                    ))}
                    <span style={{ fontSize: '0.65rem', background: '#000', padding: '2px 8px', borderRadius: '4px', color: '#888' }}>MSRP: ${vinIntel.msrp.toLocaleString()}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              <input placeholder="Year" type="number" className="input-field" value={vehicleYear} onChange={e => setVehicleYear(e.target.value)} />
              <input placeholder="Make" className="input-field" value={vehicleMake} onChange={e => setVehicleMake(e.target.value)} />
              <input placeholder="Model" className="input-field" value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} />
            </div>
            <button onClick={handleAddVehicle} className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Plus size={16} /> Add Vehicle
            </button>
          </div>
        </div>
      </div>

      {errors && <p style={{ color: 'var(--color-error)', textAlign: 'center', marginTop: '2rem' }}>{errors}</p>}

      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '5rem', justifyContent: 'center' }}>
        <button onClick={prevStep} className="btn-secondary" style={{ padding: '14px 45px' }}>Back</button>
        <button onClick={handleNext} className="btn-primary" style={{ padding: '14px 65px' }}>Next: Coverage Selection</button>
      </div>
    </motion.div>
  );
}
