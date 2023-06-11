self.addEventListener('push', (e) => {
  const json = e.data.json();

  e.waitUntil(self.registration.showNotification(
    `@${json.username}`,
    {
      body: json.message,
      icon: '/icon.png',
      image: json.avatar_url,
      timestamp: Date.parse(json.posted_at)
    }
  ));
});
