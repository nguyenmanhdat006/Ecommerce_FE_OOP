export const getUserId = (user) =>
  typeof user === "string" ? user : user?.userId || user?.id;
