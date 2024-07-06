const maskEmailAddress = (email: string) => {
  return email.replace(/^(.)(.*)(.@.*)$/, (_, a, b, c) => a + b.replace(/./g, "*") + c);
};

const generateUserNameFromEmail = (email) => {
  const nameParts = email.replace(/@.+/, "");
  const name = nameParts.replace(/[&/\\#,+()$~%._@'":*?<>{}]/g, "");
  return name + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
};

export { maskEmailAddress, generateUserNameFromEmail };
