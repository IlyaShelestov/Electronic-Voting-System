import { apiClient } from './apiClient';

export class OtpService {

    public static async sendOtp(email: string): Promise<void> {
        const response = await apiClient.post("/otp/send", { email });
        return response.data;
    }
}