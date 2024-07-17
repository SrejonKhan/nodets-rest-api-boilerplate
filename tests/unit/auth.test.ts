import { maskEmailAddress, generateUserNameFromEmail } from "../../src/utils/string";

test("Mask Email Address", () => {
  expect(maskEmailAddress("user@example.com")).toBe("u**r@example.com");
});

test("Generate Username from Email", () => {
  expect(generateUserNameFromEmail("user@example.com")).toMatch(/^user\d{4}$/);
});
