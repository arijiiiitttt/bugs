function matches(grant, perm) {
  if (grant === '*') return true;
  if (grant.endsWith(':*')) return perm.startsWith(grant.slice(0, -1));
  return grant === perm;
}

export function createRbac(config) {
  const roles = config.roles ?? {};
  function can(userRoles, permission) {
    const list = userRoles == null ? [] : Array.isArray(userRoles) ? userRoles : [userRoles];
    const seen = new Set();
    const stack = [...list];
    while (stack.length) {
      const name = stack.pop();
      if (seen.has(name) || !Object.hasOwn(roles, name)) continue;
      seen.add(name);
      const role = roles[name];
      if ((role.can ?? []).some((g) => matches(g, permission))) return true;
      stack.push(...(role.inherits ?? []));
    }
    return false;
  }
  return { can };
}
