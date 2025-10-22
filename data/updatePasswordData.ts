import { UpdatePasswordRequest } from "../pages/api/UpdatePasswordApi";

// Base test data - use this with spread operator for modifications
export const baseUpdatePasswordData: UpdatePasswordRequest = {
    UserName: "testuser123",
    Password: "NewSecurePassword123!"
};

// Valid test data variations
export const validUpdatePasswordData: UpdatePasswordRequest = {
    ...baseUpdatePasswordData
};

export const minimalUpdatePasswordData: UpdatePasswordRequest = {
    ...baseUpdatePasswordData,
    Password: "NewPassword123"
};

export const completeUpdatePasswordData: UpdatePasswordRequest = {
    ...baseUpdatePasswordData
};

// Authentication test data
export const validAuthToken = "valid_auth_token_123";
export const invalidAuthToken = "invalid_token_xyz";
export const validSessionId = "valid_session_id_456";
export const invalidSessionId = "invalid_session_xyz";
