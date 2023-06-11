self.addEventListener('push', (e) => {
  const json = e.data.json();

  console.log('Notification!');

  e.waitUntil(self.registration.showNotification(
    `@${json.username}`,
    {
      body: json.message,
      badge: '/badge.png',
      timestamp: Date.parse(json.posted_at)
    }
  ));
});
