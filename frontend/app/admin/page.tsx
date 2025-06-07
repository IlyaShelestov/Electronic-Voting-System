"use client";
import './Admin.scss';

import UserManagement from '@/components/UserManagement/UserManagement';

export default function AdminPage() {
    return (
        <div className="admin-page">
            <UserManagement />
        </div>
    );
}

