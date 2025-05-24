
import { IUser } from '@/models/IUser';
import { apiClient } from './apiClient';


export async function fetchUsers() {
    const response = await apiClient.get(`/admin/users`);
    if (response.status !== 200) {
        throw new Error('Failed to fetch users');
    }
    return response.data;
}

export async function createUser(userData: IUser) {
    const response = await apiClient.post(`/admin/users`, userData);
    if (response.status !== 200) {
        throw new Error('Failed to create user');
    }
    return response.data;
}

export async function updateUser(userId: number, userData: Partial<IUser>) {
    const response = await apiClient.put(`/admin/users/${userId}`, userData);
    if (response.status !== 200) {
        throw new Error('Failed to update user');
    }
    return response.data;
}

export async function deleteUser(userId: number) {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    if (response.status !== 200) {
        throw new Error('Failed to delete user');
    }
    return response.data;
}

export async function fetchRequests() {
    const response = await apiClient.get(`/admin/requests`);
    if (response.status !== 200) {
        throw new Error('Failed to fetch requests');
    }
    return response.data;
}

export async function approveRequest(requestId: number) {
    const response = await apiClient.post(`/admin/requests/${requestId}/approve`);
    if (response.status !== 200) {
        throw new Error('Failed to approve request');
    }
    return response.data;
}

export async function rejectRequest(requestId: number) {
    const response = await apiClient.post(`/admin/requests/${requestId}/reject`);
    if (response.status !== 200) {
        throw new Error('Failed to reject request');
    }
    return response.data;
} 