import { describe, it, expect } from "@jest/globals";
import { authenticateUser } from "../../services/auth.js";

describe("Authentication Service", () => {
  describe("authenticateUser", () => {
    it("should return user when credentials are valid", async () => {
      const username = "alice";
      const password = "admin123";

      const user = await authenticateUser(username, password);

      expect(user).toBeDefined();
      expect(user?.username).toBe("alice");
      expect(user?.userId).toBe("550e8400-e29b-41d4-a716-446655440001");
    });

    it("should return undefined when username does not exist", async () => {
      const username = "nosuchuser";
      const password = "admin123";

      const user = await authenticateUser(username, password);

      expect(user).toBeUndefined();
    });

    it("should return undefined when password is invalid", async () => {
      const username = "alice";
      const password = "wrongpassword";

      const user = await authenticateUser(username, password);

      expect(user).toBeUndefined();
    });
  });
});
