import React, { useState } from 'react';
import './OtpModal.scss';

interface OtpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (otp: string) => void;
}

const OtpModal: React.FC<OtpModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [otp, setOtp] = useState('');

    const handleSubmit = () => {
        onSubmit(otp);
        setOtp('');
    };

    if (!isOpen) return null;

    return (
        <div className="otp-modal">
            <div className="otp-modal__content">
                <h2>Enter OTP</h2>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                />
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default OtpModal; 