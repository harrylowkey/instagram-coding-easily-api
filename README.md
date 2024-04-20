# Instagram Coding Easily API

## Set up Facebook Developer App
- App type: Business

## Facebook Access Token Notes

- AccessToken: Long-Lived User Access Token - that never expired
https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived#long-lived-page-token

The documents said it must be Long-Live Page Access Token that is now wrong - expired time is only 2 hours

- Shorted-Lived access token: 1 hour
- Page Long-Lived access token: 2 hours
- User Long-Lived access token: never expired

## Installation

```bash
$ pnpm install
```

## Copy secret env
```bash
cp .env.example .env
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

commands:
- create-post:
    ? Do you have image?
    - Yes:
        - imageUrl
        - caption
        - hashtags
    - No:
        - code
        - caption
        - hashtags
- verify-post:
    - accept
    - no:
        - auto generate new one?
        - Yes:
        - No:
