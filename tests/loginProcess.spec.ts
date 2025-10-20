import { test, expect } from './fixtures/loginProcessFixture';
import { LoginProcessRequest, LoginProcessResponse } from "../pages/api/LoginProcessApi";
import { minimumRequestBody, completeRequestBody } from "../data/loginProcessData";

test.describe('Login Process API Tests', () => {

    test('should successfully login with minimum required data', async ({ loginProcessApi }) => {
        const response = await loginProcessApi.loginProcessPost(minimumRequestBody);
        const loginResponse: LoginProcessResponse = await response.json();
        
        expect(response.ok()).toBeTruthy();
        await loginProcessApi.validateLoginProcessResponse(loginResponse, minimumRequestBody);
    });

    test('should successfully login with complete data', async ({ loginProcessApi }) => {
        const response = await loginProcessApi.loginProcessPost(completeRequestBody);
        const loginResponse: LoginProcessResponse = await response.json();
        
        expect(response.ok()).toBeTruthy();
        await loginProcessApi.validateLoginProcessResponse(loginResponse, completeRequestBody);
    });

    test('should return correct data types and formats in response', async ({ loginProcessApi }) => {
        const response = await loginProcessApi.loginProcessPost(completeRequestBody);
        const loginResponse: LoginProcessResponse = await response.json();
        
        expect(response.ok()).toBeTruthy();
        
        // Validate data types
        expect(typeof loginResponse.username).toBe('string');
        expect(typeof loginResponse.password).toBe('string');
        expect(typeof loginResponse.authToken).toBe('string');
        expect(typeof loginResponse.sessionId).toBe('string');
        expect(typeof loginResponse.deviceId).toBe('string');
        expect(typeof loginResponse.memberNumber).toBe('string');
        
        // Validate formats (non-empty strings)
        expect(loginResponse.username.length).toBeGreaterThan(0);
        expect(loginResponse.password.length).toBeGreaterThan(0);
        expect(loginResponse.authToken.length).toBeGreaterThan(0);
        expect(loginResponse.sessionId.length).toBeGreaterThan(0);
        expect(loginResponse.deviceId.length).toBeGreaterThan(0);
        expect(loginResponse.memberNumber.length).toBeGreaterThan(0);
    });

    test('should return correct response headers', async ({ loginProcessApi }) => {
        const response = await loginProcessApi.loginProcessPost(completeRequestBody);
        
        expect(response.ok()).toBeTruthy();
        
        // Validate content type
        expect(response.headers()['content-type']).toContain('application/json');
        
        // Validate other important headers
        expect(response.headers()).toHaveProperty('content-type');
    });

    test('should return correct status code', async ({ loginProcessApi }) => {
        const response = await loginProcessApi.loginProcessPost(completeRequestBody);
        
        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
    });

    test('should return same data values from request in response', async ({ loginProcessApi }) => {
        const response = await loginProcessApi.loginProcessPost(completeRequestBody);
        const loginResponse: LoginProcessResponse = await response.json();
        
        expect(response.ok()).toBeTruthy();
        
        // Validate that request values match response values
        expect(loginResponse.authToken).toBe(completeRequestBody.authToken);
        expect(loginResponse.sessionId).toBe(completeRequestBody.sessionId);
        expect(loginResponse.username).toBe(completeRequestBody.userId.toString());
    });

    test('should fail with invalid auth token', async ({ loginProcessApi }) => {
        const invalidPayload: LoginProcessRequest = {
            ...completeRequestBody,
            authToken: 'invalid_token_xyz'
        };
        
        const response = await loginProcessApi.loginProcessPost(invalidPayload);
        
        expect(response.ok()).toBeFalsy();
        expect(response.status()).toBe(401);

            // Verify error message contains expected information
        const responseText = await response.text();
        expect(responseText).toContain('unauthorized'); // or whatever error message the API returns
    });

    test('should not contain unexpected fields in response', async ({ loginProcessApi }) => {
        const response = await loginProcessApi.loginProcessPost(completeRequestBody);
        const loginResponse: LoginProcessResponse = await response.json();
        
        expect(response.ok()).toBeTruthy();
        
        // Get expected fields from LoginProcessResponse interface by creating a sample object
        const sampleResponse: LoginProcessResponse = {
            username: '',
            password: '',
            authToken: '',
            sessionId: '',
            deviceId: '',
            memberNumber: ''
        };
        
        const expectedFields = Object.keys(sampleResponse);
        const responseKeys = Object.keys(loginResponse);
        
        expect(responseKeys.length).toBe(expectedFields.length);
        expect(responseKeys).toEqual(expect.arrayContaining(expectedFields));
    });
});
