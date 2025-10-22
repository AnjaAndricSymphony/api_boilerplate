import { APIRequestContext } from "@playwright/test";
import { expect } from "@playwright/test";

export class BaseAPI {

    constructor (protected request: APIRequestContext){
    }

    async  get(endpoint:string) {
        const response = await this.request.get(endpoint);
        //expect(response.ok()).toBeTruthy();
        return response;
    }

    async post(endpoint:string, data:Record<string, any>, headers?:Record<string, any>){
        const response = await this.request.post(endpoint, {data, ...(headers && { headers }),});
        //expect(response.ok()).toBeTruthy();
        return response;
    }

    // Reusable validation methods
    async validateSuccessfulResponse(response: any) {
        expect.soft(response.status()).toBe(200);
        expect.soft(response.ok()).toBeTruthy();
    }

    async validateErrorResponse(response: any, expectedStatus: number = 400) {
        expect.soft(response.ok()).toBeFalsy();
        expect.soft(response.status()).toBe(expectedStatus);
    }

    async validateAuthErrorResponse(response: any) {
        expect.soft(response.ok()).toBeFalsy();
        expect.soft(response.status()).toBe(401);
    }

    async validateForbiddenResponse(response: any) {
        expect.soft(response.ok()).toBeFalsy();
        expect.soft(response.status()).toBe(403);
    }
}