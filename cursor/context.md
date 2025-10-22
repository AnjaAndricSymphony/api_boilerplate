# 🧠 BUSINESS CONTEXT

This project tests REST API for bank web and mobile application. Goal of the application is that the user should securely log into the app using enhanced MFA options so that their accounts stay protected from unauthorized access. Login with user name and password should stay consistent across bot applications. Secure identity verification system confirm identity using government ID and facial recognition when they create usernames, reset password or use new device in mobile banking app

Main processes are:
- Token and session management
- device recognition
- number and password login


Main goal of the tests is to verify that all endpoint return valid data, that all data types are correct, that all mandatory fields are there, that negative test cases cover all bad paths (errors, status codes, messages...).

# 🧱 TEST ARCHITECTURE

**Folder structure:**

/tests/ # Main tests for all endpoints organized by folders where folder name is endpoint name
/pages/api/ # Page Object Model classes for every endpoint
/data/ # Test data for all endpoints where each endpoint has its own test data file (JSON, TS objects)
/utils/ # Helpers and validators 
/fixtures/ # Fixture setup file


**Rules:**
- Each endpoint has its **class** (`LoginAPI`, `RegisterAPI`, `UsersAPI`...).
- Class has methods for sending the request  (`post`, `get`, `delete`...).
- Class has methods to validate the response  (`validateResponse`, `validateError`).
- Class has interface for request and response (`LoginAPIRequest`, `LoginAPIResponse`)
- Tests use POM classes, not the request directly.

---

# 💡 CODING PRINCIPLES

- Use **TypeScript** and **Playwright test runner**
- Follow **Page Object Model (POM)** principal
- **Clean Code**: readibility > complexity
- One test = one scenario
- Soft assertions: use `expect.soft`
- No hardcoded values  → use `/data`
- Separate request logic, test logic and validations
- Tests should be **selfdocumented** (readable title and structure)
- **Use spread operator for test data variations** → create base data object and modify only specific fields with `{ ...baseData, field: newValue }`

---

# 🧪 TEST STRATEGY

Each endpoint must have following test types:

### ✅ Positive scenario
1. valid request (validate response)
2. valid request with minimal data set (validate that optional fields are not required)
3. Valid request with complete data set (validate full payload)
4. Validate data types and formats in response (validate that response fields are all in correct format )
5. Validate response header
6. Validate status code -> status 200
7. Validate response time (<2s)
8. Validate that values sent in the request are the same as in the response
// 5. Validate business requirements for fields (eg status = active, price >0, email format is valid)

### ❌ Negative scenario
1. Missing required fields. if there are multiple required fields check all in separate test cases
2. Invalid data type sent
3. Invalid data sent
4. Invalid format sent (example: bad uuid, wrong date)
5. Empty body sent (check status code 400 and message)
6. Response doesn't contain unexpected fields
7. Malformed json (check status code 400 and message)
8. Invalid content type (status code 415?)
9. Invalid enum value only if request body uses enums
10. Request sent with max values for strings and numbers
11. Invalid query parameters for  GET method


### AUTH:
1. Missing auth token
2. Expired token (status code 401)
3. Invalid token format
4. Insufficient permission (403)
5. Invalid sessionID
6. Valid token not matching the user?? Unauthorized 401

### EDGE CASE:
??boundary values
1. null values in optional fields
2. Invalid character (special characters sent like š)

### ERROR HANDLING:
1. error format is consistent (code, message details)
2. no sensitive data in error

### SECURITY:
1. No sensitive data in response (passwords, tokens, keys)
2. no caching of sensitive endpoints (cache-control: no-store) ??
3. no data leakage in headers (no x-powered-by)

### TECHNICAL:
1. http method allowed (only post on post, get not allowed)
2. unsupported method 405
3. CORS headers set correctly


# 🔍 VALIDATIONS

### Type validation
Check all fields are in correct type:
```ts
expect.soft(typeof body.username).toBe('string'); //can we give here username, will it literaly check for user name or we need some universal name like parameter, field?
expect.soft(typeof body.deviceId).toBe('string');
```

### Required field validation
```ts
for (const field of ['username', 'authToken', 'sessionId', 'deviceId', 'memberNumber']) {
  expect.soft(body).toHaveProperty(field);
}
```

### No extra keys
```ts
const allowed = ['username', 'authToken', 'sessionId', 'deviceId', 'memberNumber'];
for (const key of Object.keys(body)) {
  expect.soft(allowed.includes(key)).toBeTruthy();
}
```

### Status code and response time
```ts
expect.soft(response.status()).toBe(200);
expect.soft(response.timing().duration).toBeLessThan(2000);
```

AUTHENTICATION & CONFIG:

- All API calls must have authToken i sessionId.
- authToken i sessionId are obtained either from previous test or from calling aut0 service.
- Default Base URL: read from .env → BASE_URL
- Headers: Authorization: Bearer {authToken}, x-session-id: {sessionId}

### EXAMPLE TEST STYLE
```ts
test('should login user successfully and return memberNumber', async ({ request }) => {
  const response = await loginAPI.loginUser(validLoginPayload);
  const body = await response.json();

  expect.soft(response.status()).toBe(200);
  expect.soft(body).toHaveProperty('memberNumber');
  // expect.soft(body.memberNumber).toMatch(/^[0-9]+$/);
});
```
### EXAMPLE POM CLASS
```ts
export class LoginAPI {
  constructor(private request: APIRequestContext) {}

  async loginUser(data: any, headers?: Record<string, string>) {
    const endpoint = process.env.LOGIN_POST;
    return await this.request.post(endpoint, {
      data,
      ...(headers && { headers }),
    });
  }

  async validateResponse(body: any) {
    expect.soft(body).toHaveProperty('deviceId');
    expect.soft(body).toHaveProperty('memberNumber');
    expect.soft(typeof body.deviceId).toBe('string');
  }
}
```
### AI GENERATION RULES
When generating test or code with AI:
- use typescript + Playwright
- use POM pattern (one class per endpoint)
- use soft assertions
- don't put hardcoded values -> use test data
- generate clean, business-friendly test titles
- group tests in test.describe blocks
- create test file per each endpoint
- create first positive test cases then negative and then the others (auth, edge cases...)


### NAMING & STYLE GUIDE

Files:
- Test: login.spec.ts
- POM: LoginAPI.ts
- Data: loginData.ts

Test titles:

✅ "should login user successfully with valid credentials"

❌ "test login endpoint"

Class methods:

- loginUser(), validateResponse(), validateErrorResponse()

### AI BEHAVIOR GUIDELINES

When AI generates code:
- start from this context file
- mandatorily use same stile, structure and naming convention
- add minimal comments only where it explains business logic
- avoid unnecessary comments or duplicates
- use modern TS/ES6 standards (async/await, const, arrow functions)

### SUMMARY
This context defines all principals and rules that AI should use when generation playwright tests and POM classes for API testing. 

Everyting AI generates must be:
- Readable
- Modular
- Easy maintainable
- According to business logic and principals from this document.
