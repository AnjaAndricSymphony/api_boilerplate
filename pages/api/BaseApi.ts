import { APIRequestContext } from "@playwright/test";

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
}