import { test as base } from '@playwright/test';
import { loginProcessService } from '../../pages/api/LoginProcessApi';
// import { GetUsersService } from '../../pages/api/GetUsersApi';

// Define the types of fixtures
type ApiFixtures = {
    loginProcessApi: loginProcessService;
    // getUsersApi: GetUsersService;
};

// Extend base test with fixtures
export const test = base.extend<ApiFixtures>({
    loginProcessApi: async ({ request }, use) => {
        const loginProcessApi = new loginProcessService(request);
        await use(loginProcessApi);
    },
    
    // getUsersApi: async ({ request }, use) => {
    //     const getUsersApi = new GetUsersService(request);
    //     await use(getUsersApi);
    // },
});

export { expect } from '@playwright/test';
