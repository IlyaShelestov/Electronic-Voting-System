
import { IUser } from '@/models/IUser';
import { apiClient } from './apiClient';


export class AdminService {
    public static async fetchUsers() {
        const response = await apiClient.get(`/admin/users`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch users');
        }
        return response.data;
    }

    public static async createUser(userData: IUser) {
        const response = await apiClient.post(`/admin/users`, userData);
        if (response.status !== 200) {
            throw new Error('Failed to create user');
        }
        return response.data;
    }

    public static async updateUser(userId: number, userData: Partial<IUser>) {
        const response = await apiClient.put(`/admin/users/${userId}`, userData);
        if (response.status !== 200) {
            throw new Error('Failed to update user');
        }
        return response.data;
    }

    public static async deleteUser(userId: number) {
        const response = await apiClient.delete(`/admin/users/${userId}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete user');
        }
        return response.data;
    }

    public static async fetchRequests() {
        const response = await apiClient.get(`/admin/requests`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch requests');
        }
        return response.data;
    }

    public static async fetchRequest(requestId: number) {
        const response = await apiClient.get(`/admin/requests/${requestId}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch request');
        }
        return response.data;
    }

    public static async approveRequest(requestId: number) {
        const response = await apiClient.post(`/admin/requests/${requestId}/approve`);
        if (response.status !== 200) {
            throw new Error('Failed to approve request');
        }
        return response.data;
    }

    public static async rejectRequest(requestId: number) {
        const response = await apiClient.post(`/admin/requests/${requestId}/reject`);
        if (response.status !== 200) {
            throw new Error('Failed to reject request');
        }
        return response.data;
    }
}