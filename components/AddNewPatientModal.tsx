
import React, { useState, useEffect } from 'react';
import type { Patient } from '../types';
import { Gender } from '../types';

interface AddNewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (newPatientData: Omit<Patient, 'id' | 'results' | 'avatar'>) => void;
}

const initialFormData = {
    name: '',
    age: '',
    gender: Gender.FEMALE,
    hospital: '',
    contact: { email: '', phone: '', address: '' },
    caregiver: { name: '', relation: '', phone: '' },
};

const FormInput: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean, type?: string}> = 
({label, name, value, onChange, required=true, type="text"}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
        />
    </div>
);


export const AddNewPatientModal: React.FC<AddNewPatientModalProps> = ({ isOpen, onClose, onAddPatient }) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // FIX: The original `handleChange` implementation caused a TypeScript error because it tried to
  // spread a property that could be a non-object type. This updated version uses a type guard
  // to ensure that `parent` is a key corresponding to an object ('contact' or 'caregiver') before
  // attempting to spread it for an update. This resolves the "Spread types may only be created from object types" error.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
        const [parent, child] = name.split('.');
        if (parent === 'contact' || parent === 'caregiver') {
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        }
    } else {
        setFormData(prev => ({...prev, [name]: value}));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPatient({
        ...formData,
        age: parseInt(formData.age, 10),
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all my-8"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
            <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Add New Patient</h3>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="border-b pb-6">
                    <h4 className="text-md font-semibold text-gray-700 mb-4">Personal Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                        <FormInput label="Age" name="age" value={formData.age} onChange={handleChange} type="number"/>
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-brand-blue focus:border-brand-blue">
                                {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <FormInput label="Hospital" name="hospital" value={formData.hospital} onChange={handleChange} />
                    </div>
                </div>
                <div className="border-b pb-6">
                    <h4 className="text-md font-semibold text-gray-700 mb-4">Patient Contact</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput label="Email" name="contact.email" value={formData.contact.email} onChange={handleChange} type="email" />
                        <FormInput label="Phone" name="contact.phone" value={formData.contact.phone} onChange={handleChange} />
                        <div className="sm:col-span-2">
                          <FormInput label="Address" name="contact.address" value={formData.contact.address} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-4">Caregiver Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <FormInput label="Caregiver Name" name="caregiver.name" value={formData.caregiver.name} onChange={handleChange} />
                       <FormInput label="Relation" name="caregiver.relation" value={formData.caregiver.relation} onChange={handleChange} />
                       <FormInput label="Caregiver Phone" name="caregiver.phone" value={formData.caregiver.phone} onChange={handleChange} />
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-brand-blue-dark"
                >
                    Add Patient
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};