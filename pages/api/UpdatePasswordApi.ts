import type test = require("@playwright/test");
import { BaseAPI } from "./BaseApi";
import { expect } from "@playwright/test";

export interface UpdatePasswordRequest {
    UserName: string;
    Password: string;
}

export interface UpdatePasswordResponse {
    UserName: string;
    OldPassword: string;
    NewPassword: string;
    Date: string;
}

export class UpdatePasswordService extends BaseAPI {
    private url: string;

    constructor(request: test.APIRequestContext) {
        super(request);
        this.url = process.env.BASE_URL + "/api/updatepassword"; // Update with actual endpoint
    }

    async updatePassword(payload: UpdatePasswordRequest, authToken?: string, sessionId?: string) {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        if (sessionId) {
            headers['x-session-id'] = sessionId;
        }

        const response = await this.post(this.url, payload, headers);

        if (!response.ok()) {
            throw new Error(`Update password failed: ${response.status()} - ${response.statusText()}`);
        }

        return response;
    }

    async validateUpdatePasswordResponse(response: UpdatePasswordResponse) {
        if (!response) {
            throw new Error('Response is null or undefined');
        }

        // Validate required fields exist
        expect.soft(response).toHaveProperty('UserName');
        expect.soft(response).toHaveProperty('OldPassword');
        expect.soft(response).toHaveProperty('NewPassword');
        expect.soft(response).toHaveProperty('Date');

        // Validate data types
        expect.soft(typeof response.UserName).toBe('string');
        expect.soft(typeof response.OldPassword).toBe('string');
        expect.soft(typeof response.NewPassword).toBe('string');
        expect.soft(typeof response.Date).toBe('string');

        // Validate formats (non-empty strings)
        expect.soft(response.UserName.length).toBeGreaterThan(0);
        expect.soft(response.OldPassword.length).toBeGreaterThan(0);
        expect.soft(response.NewPassword.length).toBeGreaterThan(0);
        expect.soft(response.Date.length).toBeGreaterThan(0);
    }

    async validateErrorResponse(response: any) {
        if (!response) {
            throw new Error('Error response is null or undefined');
        }

        // Validate error format is consistent
        expect.soft(response).toHaveProperty('code');
        expect.soft(response).toHaveProperty('message');
        
        // Validate no sensitive data in error
        expect.soft(JSON.stringify(response)).not.toContain('password');
        expect.soft(JSON.stringify(response)).not.toContain('token');
    }
}
