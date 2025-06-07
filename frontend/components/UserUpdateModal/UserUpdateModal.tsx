"use client";
import './UserUpdateModal.scss';

import { useState } from 'react';

import { IUser } from '@/models/IUser';

interface UserUpdateModalProps {
    user: IUser;
    onClose: () => void;
    onSave: (user: IUser) => void;
}

export default function UserUpdateModal({ user, onClose, onSave }: UserUpdateModalProps) {
    const [formData, setFormData] = useState<IUser | null>(user);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value } as IUser);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value } as IUser);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            onSave(formData);
        }
    };

    const handleOutsideClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal" onClick={handleOutsideClick}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Update User</h2>
                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="form-group">
                        <label htmlFor="first_name">First Name</label>
                        <input type="text" id="first_name" name="first_name" value={formData?.first_name || ''} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="last_name">Last Name</label>
                        <input type="text" id="last_name" name="last_name" value={formData?.last_name || ''} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData?.email || ''} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="iin">IIN</label>
                        <input type="text" id="iin" name="iin" value={formData?.iin || ''} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="patronymic">Patronymic</label>
                        <input type="text" id="patronymic" name="patronymic" value={formData?.patronymic || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date_of_birth">Date of Birth</label>
                        <input type="date" id="date_of_birth" name="date_of_birth" value={formData?.date_of_birth || ''} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city_id">City ID</label>
                        <input type="number" id="city_id" name="city_id" value={formData?.city_id || ''} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone_number">Phone Number</label>
                        <input type="text" id="phone_number" name="phone_number" value={formData?.phone_number || ''} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select id="role" name="role" value={formData?.role || 'user'} onChange={handleSelectChange}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
} 