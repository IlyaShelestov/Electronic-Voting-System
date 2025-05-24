"use client";
import UserManagement from '@/components/UserManagement/UserManagement';
import RequestHandling from './RequestHandling';
import './Admin.scss';

export default function AdminPage() {
    return (
        <div className="admin-page">
            <UserManagement />
        </div>
    );
}

