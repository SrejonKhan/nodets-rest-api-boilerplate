const maskEmailAddress = (email: string) => {
  return email.replace(/^(.)(.*)(.@.*)$/, (_, a, b, c) => a + b.replace(/./g, "*") + c);
};

export { maskEmailAddress };
