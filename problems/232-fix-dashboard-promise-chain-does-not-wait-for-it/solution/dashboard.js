export function loadDashboard(api) {
  const dash = {};
  return api
    .getUser()
    .then((user) => {
      dash.user = user;
      return api.getPosts(user.id);
    })
    .then((posts) => {
      dash.posts = posts;
      return api.getNotifications(dash.user.id);
    })
    .then((notifications) => {
      dash.notifications = notifications;
      return dash;
    });
}
