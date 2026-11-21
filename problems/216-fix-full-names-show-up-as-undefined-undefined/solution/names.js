export async function getFullName(id, repo) {
  const user = await repo.findUser(id);
  if (!user) throw new Error('User not found: ' + id);
  return user.first + ' ' + user.last;
}

export async function getFullNames(ids, repo) {
  return Promise.all(ids.map((id) => getFullName(id, repo)));
}
