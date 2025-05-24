import { apiClient } from './apiClient';

export class otpService {

    static async sendOtp(email: string): Promise<void> {
        const response = await apiClient.post("/otp/send", { email });
        return response.data;
    }
}