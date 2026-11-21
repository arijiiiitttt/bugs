export async function sendAll(users, send) {
  const sent = [];
  users.forEach(async (user) => {
    await send(user);
    sent.push(user.id);
  });
  return sent;
}
