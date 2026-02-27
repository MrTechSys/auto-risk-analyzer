import { useState } from 'react';
import { useRiskStore } from '../store/useRiskStore';
import { motion } from 'framer-motion';
import { z } from 'zod';

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

  const [errors, setErrors] = useState<string | null>(null);

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
      className="container full-screen flex-center"
      style={{ flexDirection: 'column', padding: '4rem 0' }}
    >
      <h2 style={{ marginBottom: '2rem' }}>Drivers & <span className="text-gold">Vehicles</span></h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1000px' }}>
        
        {/* Drivers Section */}
        <div style={{ background: 'var(--color-grey-dark)', padding: '2rem', borderRadius: '16px', border: '1px solid #222' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Drivers</h3>
          <div style={{ marginBottom: '1.5rem', minHeight: '60px' }}>
            {policy.drivers.map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                <span>{d.firstName} {d.lastName} ({d.age})</span>
                <button onClick={() => removeDriver(d.id)} style={{ color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input placeholder="Full Name" className="input-field" style={{ flex: '1 1 100%' }} value={driverName} onChange={e => setDriverName(e.target.value)} />
            <input placeholder="Age" type="number" className="input-field" style={{ flex: '1 1 60px' }} value={driverAge} onChange={e => setDriverAge(e.target.value)} />
            <button onClick={handleAddDriver} className="btn-secondary" style={{ flex: '1 1 auto' }}>Add Driver</button>
          </div>
        </div>

        {/* Vehicles Section */}
        <div style={{ background: 'var(--color-grey-dark)', padding: '2rem', borderRadius: '16px', border: '1px solid #222' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Vehicles</h3>
          <div style={{ marginBottom: '1.5rem', minHeight: '60px' }}>
            {policy.vehicles.map(v => (
              <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                <span>{v.year} {v.make} {v.model}</span>
                <button onClick={() => removeVehicle(v.id)} style={{ color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '0.5rem', width: '100%' }}>
            <input placeholder="Year" type="number" className="input-field" value={vehicleYear} onChange={e => setVehicleYear(e.target.value)} />
            <input placeholder="Make" className="input-field" value={vehicleMake} onChange={e => setVehicleMake(e.target.value)} />
            <input placeholder="Model" className="input-field" value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} />
            <input placeholder="VIN (Optional)" className="input-field" style={{ gridColumn: 'span 3' }} value={vehicleVIN} onChange={e => setVehicleVIN(e.target.value)} />
            <button onClick={handleAddVehicle} className="btn-secondary" style={{ gridColumn: 'span 3' }}>Add Vehicle</button>
          </div>
        </div>
      </div>

      {errors && <p style={{ color: 'var(--color-error)', marginTop: '1.5rem' }}>{errors}</p>}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
        <button onClick={prevStep} className="btn-secondary">Back</button>
        <button onClick={handleNext} className="btn-primary">Next: Coverages</button>
      </div>
    </motion.div>
  );
}
