import { describe, it, expect } from "@jest/globals";
import { createToken, findUser, validateToken } from "../../services/auth.js";

describe("Authentication Service", () => {
  describe("finderUser", () => {
    it("should return user when credentials are valid", async () => {
      const username = "admin";
      const password = "admin123";

      const user = await findUser(username, password);

      expect(user).toBeDefined();
      expect(user?.username).toBe("admin");
      expect(user?.role).toBe("admin");
    });

    it("should return undefined when username does not exist", async () => {
      const username = "nosuchuser";
      const password = "admin123";

      const user = await findUser(username, password);

      expect(user).toBeUndefined();
    });

    it("should return undefined when password is invalid", async () => {
      const username = "admin";
      const password = "wrongpassword";

      const user = await findUser(username, password);

      expect(user).toBeUndefined();
    });
  });
});

describe("Token Management", () => {
  it("should create and validate a token", () => {
    const username = "admin";
    const role = "admin";

    const token = createToken(username, role);
    const userData = validateToken(token);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(userData).toBeDefined();
    expect(userData?.username).toBe(username);
    expect(userData?.role).toBe(role);
  });

  it("should return undefined for invalid token", () => {
    const invalidToken = "invalid_token_123";

    const userData = validateToken(invalidToken);

    expect(userData).toBeUndefined();
  });
});
