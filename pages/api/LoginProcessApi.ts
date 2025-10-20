import type test = require("@playwright/test");
import { expect } from "@playwright/test";
import { BaseAPI } from "./BaseApi";

export interface LoginProcessRequest {
  userId: number;
  id?: number;
  title?: string;
  //body: string;
  authToken: string,
  sessionId: string
}

export interface LoginProcessResponse {
    username: string;
  password: string;
  authToken: string;
  sessionId: string;
  deviceId: string;
  memberNumber: string;
}


export class loginProcessService extends BaseAPI {
    // private request: test.APIRequestContext;
    private url: string;

    constructor (request: test.APIRequestContext){
        super(request);
        this.url = "AppSettings.SunBlockUrl + AppSettings.SunBlockServiceUrl" //proveri u app-u sta je ovo tacno, ovo je primer iz cursora
    }

async loginProcessPost(payload: LoginProcessRequest){
     const response =  await this.post(this.url, {data:payload, headers: { Authorization: `Bearer ${payload.authToken}`,
        'Content-Type': 'application/json',
        'X-Session-ID': payload.sessionId}});

    if (!response.ok()) {
        throw new Error(`Login process failed: ${response.status()} - ${response.statusText()}`);
    }
    
    return response;
}

async validateLoginProcessResponse(response: LoginProcessResponse, expected: LoginProcessRequest){
    if (!response) {
        throw new Error('Response is null or undefined');
    }
    
    expect(response.username).toBe(expected.userId.toString());
    expect(response.password).toBeDefined();
    expect(response.authToken).toBe(expected.authToken);
    expect(response.sessionId).toBe(expected.sessionId);
    expect(response.deviceId).toBeDefined();
    expect(response.memberNumber).toBeDefined();
}

}