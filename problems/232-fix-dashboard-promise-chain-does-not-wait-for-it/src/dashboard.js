export function loadDashboard(api) {
  const dash = {};
  return api
    .getUser()
    .then((user) => {
      dash.user = user;
      api.getPosts(user.id).then((posts) => {
        dash.posts = posts;
      });
    })
    .then(() => {
      api.getNotifications(dash.user.id).then((notifications) => {
        dash.notifications = notifications;
      });
    })
    .then(() => dash);
}
