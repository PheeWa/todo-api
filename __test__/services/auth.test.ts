import { describe, it, expect } from "@jest/globals";
import { findUser } from "../../services/auth.js";

describe("Authentication Service", () => {
  describe("finderUser", () => {
    it("should return user when credentials are valid", async () => {
      const username = "alice";
      const password = "admin123";

      const user = await findUser(username, password);

      expect(user).toBeDefined();
      expect(user?.username).toBe("alice");
    });

    it("should return undefined when username does not exist", async () => {
      const username = "nosuchuser";
      const password = "admin123";

      const user = await findUser(username, password);

      expect(user).toBeUndefined();
    });

    it("should return undefined when password is invalid", async () => {
      const username = "alice";
      const password = "wrongpassword";

      const user = await findUser(username, password);

      expect(user).toBeUndefined();
    });
  });
});
