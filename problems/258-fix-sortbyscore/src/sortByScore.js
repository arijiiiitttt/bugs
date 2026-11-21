export function sortByScore(players) {
  return players.sort((a, b) => b.score > a.score);
}
