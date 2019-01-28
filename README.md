# awgs-web-app
awgs-web-app is a highly experimental Web client for the AWGS GraphQL service.

## Running
Install packages with `npm install`. Start with `npm start`.

By default, it connects to an awgs-graphql instance running at `http://localhost:4000/graphql`. To
change that, change all occurrences of `http://localhost:4000/` in the code to the real host.

If the app is served from another host, change the `http://127.0.0.1:8081/` URLs in `awgs-app.js`
to your production URL.

## Build Configurations
The default build configurations from `pwa-starter-kit` have been changed with respect to the Service Worker (deactivated).

If the app is served from the `/awgs/` path, build the project with
`polymer build --base-path awgs`
