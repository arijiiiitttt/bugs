export function sortByScore(players) {
  return [...players].sort((a, b) => b.score - a.score || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}
