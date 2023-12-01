# KITeGG Directus Discord Webhook Endpoint

> Send notifications to the KITeGG Discord Server

## 🔗 API

### Send bug report

Reports can only be send by `staff` or `management` group members.

```api
POST /directus-webhook/report
```

Body (mandatory fields):

```json
{
	"issue": "This is the issue",
	"email": "admin@llp.kitegg.de",
	"platform": {
		"name": "Chrome",
		"version": "119.0.0.0",
		"os": "Mac OS"
	},
	"url": "https://llp.kitegg.de/"
}
```

## 🔒 Discord Webhook URL

For this extension to work, you will need to add a URL to a Discord webhook to your Directus configuration.

Add this to your Docker Compose configuration:

```yaml

directus:
    ...
    environment:
        ...

        DISCORD_WEBHOOK: YOUR_DISCORD_WEBHOOK
```

## 🚧 Development

```bash
npm run dev
```

## 📦 Production

```bash
npm run build
```
