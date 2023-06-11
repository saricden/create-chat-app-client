self.addEventListener('push', (e) => {
  const json = e.data.json();

  e.waitUntil(self.registration.showNotification(
    `@${json.username}`,
    {
      body: json.message,
      // icon: '/icon.png',
      // icon: json.avatar_url,
      icon: `${self.location.origin}/icon.png`,
      timestamp: Date.parse(json.posted_at)
    }
  ));
});
