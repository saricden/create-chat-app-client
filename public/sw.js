self.addEventListener('push', (e) => {
  const json = e.data.json();

  console.log('Incoming push!');
  console.log(json);

  e.waitUntil(self.registration.showNotification(
    `@${json.username}`,
    {
      body: json.message,
      timestamp: Date.parse(json.posted_at)
    }
  ));
});
