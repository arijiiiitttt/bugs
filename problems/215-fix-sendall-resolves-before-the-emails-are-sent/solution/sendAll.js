export async function sendAll(users, send) {
  return Promise.all(
    users.map(async (user) => {
      await send(user);
      return user.id;
    }),
  );
}
