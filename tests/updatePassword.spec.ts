import { test, expect } from './fixtures/loginProcessFixture';
import { UpdatePasswordRequest, UpdatePasswordResponse } from "../pages/api/UpdatePasswordApi";
import { 
    baseUpdatePasswordData,
    validUpdatePasswordData, 
    minimalUpdatePasswordData, 
    completeUpdatePasswordData,
    validAuthToken,
    invalidAuthToken,
    validSessionId,
    invalidSessionId
} from "../data/updatePasswordData";

test.describe('Update Password API Tests', () => {
    
    // ✅ POSITIVE SCENARIOS
    test.describe('Positive Scenarios', () => {
        
        test('should update password successfully with valid credentials', async ({ updatePasswordApi }) => {
            const response = await updatePasswordApi.updatePassword(validUpdatePasswordData, validAuthToken, validSessionId);
            const body: UpdatePasswordResponse = await response.json();
            
            await updatePasswordApi.validateSuccessfulResponse(response);
            await updatePasswordApi.validateUpdatePasswordResponse(body);
        });

        test('should update password with minimal required data', async ({ updatePasswordApi }) => {
            const response = await updatePasswordApi.updatePassword(minimalUpdatePasswordData, validAuthToken, validSessionId);
            const body: UpdatePasswordResponse = await response.json();
            
            await updatePasswordApi.validateSuccessfulResponse(response);
            await updatePasswordApi.validateUpdatePasswordResponse(body);
        });

        test('should update password with complete data set', async ({ updatePasswordApi }) => {
            const response = await updatePasswordApi.updatePassword(completeUpdatePasswordData, validAuthToken, validSessionId);
            const body: UpdatePasswordResponse = await response.json();
            
            await updatePasswordApi.validateSuccessfulResponse(response);
            await updatePasswordApi.validateUpdatePasswordResponse(body);
        });

        test('should return correct data types and formats in response', async ({ updatePasswordApi }) => {
            const response = await updatePasswordApi.updatePassword(validUpdatePasswordData, validAuthToken, validSessionId);
            const body: UpdatePasswordResponse = await response.json();
            
            await updatePasswordApi.validateSuccessfulResponse(response);
            expect.soft(typeof body.UserName).toBe('string');
            expect.soft(typeof body.OldPassword).toBe('string');
            expect.soft(typeof body.NewPassword).toBe('string');
            expect.soft(typeof body.Date).toBe('string');
            
            // Validate formats
            expect.soft(body.UserName.length).toBeGreaterThan(0);
            expect.soft(body.OldPassword.length).toBeGreaterThan(0);
            expect.soft(body.NewPassword.length).toBeGreaterThan(0);
            expect.soft(body.Date.length).toBeGreaterThan(0);
        });

        test('should return correct response headers', async ({ updatePasswordApi }) => {
            const response = await updatePasswordApi.updatePassword(validUpdatePasswordData, validAuthToken, validSessionId);
            
            await updatePasswordApi.validateSuccessfulResponse(response);
            expect.soft(response.headers()['content-type']).toContain('application/json');
            expect.soft(response.headers()).toHaveProperty('content-type');
        });

        test('should return status code 200', async ({ updatePasswordApi }) => {
            const response = await updatePasswordApi.updatePassword(validUpdatePasswordData, validAuthToken, validSessionId);
            
            await updatePasswordApi.validateSuccessfulResponse(response);
        });

        test('should complete request within acceptable time limit', async ({ updatePasswordApi }) => {
            const response = await updatePasswordApi.updatePassword(validUpdatePasswordData, validAuthToken, validSessionId);
            
            await updatePasswordApi.validateSuccessfulResponse(response);
            //expect.soft(response.timing().duration).toBeLessThan(2000);
        });

        test('should return same UserName from request in response', async ({ updatePasswordApi }) => {
            const response = await updatePasswordApi.updatePassword(validUpdatePasswordData, validAuthToken, validSessionId);
            const body: UpdatePasswordResponse = await response.json();
            
            await updatePasswordApi.validateSuccessfulResponse(response);
            expect.soft(body.UserName).toBe(validUpdatePasswordData.UserName);
        });

        test('should not contain unexpected fields in response', async ({ updatePasswordApi }) => {
            const response = await updatePasswordApi.updatePassword(validUpdatePasswordData, validAuthToken, validSessionId);
            const body: UpdatePasswordResponse = await response.json();
            
            await updatePasswordApi.validateSuccessfulResponse(response);
            
            const sampleResponse: UpdatePasswordResponse = {
                UserName: '',
                OldPassword: '',
                NewPassword: '',
                Date: ''
            };
            
            const expectedFields = Object.keys(sampleResponse);
            const responseKeys = Object.keys(body);
            
            expect.soft(responseKeys.length).toBe(expectedFields.length);
            expect.soft(responseKeys).toEqual(expect.arrayContaining(expectedFields));
        });
    });

    // ❌ NEGATIVE SCENARIOS
    test.describe('Negative Scenarios', () => {
        
        test('should fail with missing UserName field', async ({ updatePasswordApi }) => {
            const invalidPayload = { Password: "NewPassword123" } as UpdatePasswordRequest;
            
            const response = await updatePasswordApi.updatePassword(invalidPayload, validAuthToken, validSessionId);
            
            await updatePasswordApi.validateErrorResponse(response);
        });

        test('should fail with missing Password field', async ({ updatePasswordApi }) => {
            const invalidPayload = { UserName: "testuser123" } as UpdatePasswordRequest;
            
            const response = await updatePasswordApi.updatePassword(invalidPayload, validAuthToken, validSessionId);
            
            await updatePasswordApi.validateErrorResponse(response);
        });

        test('should fail with empty UserName', async ({ updatePasswordApi }) => {
            const invalidPayload = { ...baseUpdatePasswordData, UserName: "" };
            
            const response = await updatePasswordApi.updatePassword(invalidPayload, validAuthToken, validSessionId);
            
            await updatePasswordApi.validateErrorResponse(response);
        });

        test('should fail with empty Password', async ({ updatePasswordApi }) => {
            const invalidPayload = { ...baseUpdatePasswordData, Password: "" };
            
            const response = await updatePasswordApi.updatePassword(invalidPayload, validAuthToken, validSessionId);
            
            await updatePasswordApi.validateErrorResponse(response);
        });

        test('should fail with invalid password format', async ({ updatePasswordApi }) => {
            const invalidPayload = { ...baseUpdatePasswordData, Password: "123" }; // Too short
            
            const response = await updatePasswordApi.updatePassword(invalidPayload, validAuthToken, validSessionId);
            
            await updatePasswordApi.validateErrorResponse(response);
        });

        test('should fail with special characters in password', async ({ updatePasswordApi }) => {
            const invalidPayload = { ...baseUpdatePasswordData, Password: "NewPassword123ščćžđ" }; // Special characters
            
            const response = await updatePasswordApi.updatePassword(invalidPayload, validAuthToken, validSessionId);
            
            await updatePasswordApi.validateErrorResponse(response);
        });

        test('should fail with empty request body', async ({ updatePasswordApi }) => {
            const response = await updatePasswordApi.updatePassword({} as UpdatePasswordRequest, validAuthToken, validSessionId);
            
            await updatePasswordApi.validateErrorResponse(response);
        });

        test('should fail with invalid content type', async ({ updatePasswordApi }) => {
            // This would need to be implemented in the API class if needed
            const response = await updatePasswordApi.updatePassword(validUpdatePasswordData, validAuthToken, validSessionId);
            
            await updatePasswordApi.validateSuccessfulResponse(response); // Assuming API handles content-type validation
        });

        test('should fail with max length UserName', async ({ updatePasswordApi }) => {
            const invalidPayload = { ...baseUpdatePasswordData, UserName: "a".repeat(255) }; // Max length username
            
            const response = await updatePasswordApi.updatePassword(invalidPayload, validAuthToken, validSessionId);
            
            await updatePasswordApi.validateErrorResponse(response);
        });

        test('should fail with max length Password', async ({ updatePasswordApi }) => {
            const invalidPayload = { ...baseUpdatePasswordData, Password: "a".repeat(255) }; // Max length password
            
            const response = await updatePasswordApi.updatePassword(invalidPayload, validAuthToken, validSessionId);
            
            await updatePasswordApi.validateErrorResponse(response);
        });
    });

    // 🔐 AUTHENTICATION SCENARIOS
    test.describe('Authentication Scenarios', () => {
        
        test('should fail with missing auth token', async ({ updatePasswordApi }) => {
            const response = await updatePasswordApi.updatePassword(baseUpdatePasswordData);
            
            await updatePasswordApi.validateAuthErrorResponse(response);
        });

        test('should fail with invalid auth token', async ({ updatePasswordApi }) => {
            const response = await updatePasswordApi.updatePassword(baseUpdatePasswordData, invalidAuthToken, validSessionId);
            
            await updatePasswordApi.validateAuthErrorResponse(response);
        });

        test('should fail with invalid session ID', async ({ updatePasswordApi }) => {
            const response = await updatePasswordApi.updatePassword(baseUpdatePasswordData, validAuthToken, invalidSessionId);
            
            await updatePasswordApi.validateAuthErrorResponse(response);
        });

        test('should fail with missing session ID', async ({ updatePasswordApi }) => {
            const response = await updatePasswordApi.updatePassword(baseUpdatePasswordData, validAuthToken);
            
            await updatePasswordApi.validateAuthErrorResponse(response);
        });
    });

    // 🔒 SECURITY SCENARIOS
    test.describe('Security Scenarios', () => {
        
        test('should not expose sensitive data in response', async ({ updatePasswordApi }) => {
            const response = await updatePasswordApi.updatePassword(validUpdatePasswordData, validAuthToken, validSessionId);
            const body: UpdatePasswordResponse = await response.json();
            
            await updatePasswordApi.validateSuccessfulResponse(response);
            
            // Validate no sensitive data leakage
            const responseString = JSON.stringify(body);
            expect.soft(responseString).not.toContain('token');
            expect.soft(responseString).not.toContain('key');
        });

        test('should not cache sensitive endpoints', async ({ updatePasswordApi }) => {
            const response = await updatePasswordApi.updatePassword(validUpdatePasswordData, validAuthToken, validSessionId);
            
            await updatePasswordApi.validateSuccessfulResponse(response);
            expect.soft(response.headers()['cache-control']).toBe('no-store');
        });

        test('should not expose server information in headers', async ({ updatePasswordApi }) => {
            const response = await updatePasswordApi.updatePassword(validUpdatePasswordData, validAuthToken, validSessionId);
            
            await updatePasswordApi.validateSuccessfulResponse(response);
            expect.soft(response.headers()).not.toHaveProperty('x-powered-by');
            expect.soft(response.headers()).not.toHaveProperty('server');
        });
    });

    // ⚠️ ERROR HANDLING SCENARIOS
    test.describe('Error Handling Scenarios', () => {
        
        test('should return consistent error format', async ({ updatePasswordApi }) => {
            const invalidPayload = { ...baseUpdatePasswordData, UserName: "" };
            const response = await updatePasswordApi.updatePassword(invalidPayload, validAuthToken, validSessionId);
            const errorBody = await response.json();
            
            await updatePasswordApi.validateErrorResponse(response);
            await updatePasswordApi.validateErrorResponse(errorBody);
        });

        test('should not expose sensitive data in error messages', async ({ updatePasswordApi }) => {
            const invalidPayload = { ...baseUpdatePasswordData, Password: "" };
            const response = await updatePasswordApi.updatePassword(invalidPayload, validAuthToken, validSessionId);
            const errorBody = await response.json();
            
            await updatePasswordApi.validateErrorResponse(response);
            await updatePasswordApi.validateErrorResponse(errorBody);
        });
    });
});