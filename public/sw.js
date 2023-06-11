self.addEventListener('push', (e) => {
  const json = e.data.json();

  console.log('Notification!');

  e.waitUntil(self.registration.showNotification(
    `@${json.username}`,
    {
      body: json.message,
      badge: '/badge.png',
      icon: json.avatar_url,
      timestamp: Date.parse(json.posted_at)
    }
  ));
});
