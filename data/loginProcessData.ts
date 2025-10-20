import { LoginProcessRequest } from "../pages/api/LoginProcessApi";

export const requestBody: LoginProcessRequest = {
        userId: 111,
        id: 1234,
        title: 'some title',
        authToken: '1234wer',
        sessionId: '1234erd'
    };

    // Minimum required data for login
export const minimumRequestBody: LoginProcessRequest = {
        userId: 111,
        authToken: '1234wer',
        sessionId: '1234erd'
    };

// Complete data for login
export const completeRequestBody: LoginProcessRequest = {
        userId: 111,
        id: 1234,
        title: 'some title',
        authToken: '1234wer',
        sessionId: '1234erd'
    };


