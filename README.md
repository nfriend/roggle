# Roggle

A multiplayer Boggle clone, built with React and TypeScript.
[nathanfriend.io/roggle](https://nathanfriend.io/roggle/)

[View the source on GitLab.](https://gitlab.com/nfriend/roggle)

## Developing

1. Clone this repository
1. Run `npm install`
1. Start a local WebSocket server using `npm run server`
1. In another terminal window/tab, start a local HTTP server at the root of this
   project. For example:
   - Install [`http-server`](https://www.npmjs.com/package/http-server)
     globally: `npm install --global http-server`
   - Run `http-server` at the root of this project
1. In another terminal window/tab, build the web app using `npm run build`
1. View the web app in the browser

## Publishing

To publish a new version of Roggle, bump the version in
[`package.json`](./package.json), publish to NPM
([`@nathanfriend/roggle`](https://www.npmjs.com/package/@nathanfriend/roggle)),
and run a new pipeline in the
[`website-3.0-docker`](https://gitlab.com/nfriend/website-3.0-docker) project.

## Note to self

In order to run the node websocket server on the same server as Apache, add this
to `/etc/apache2/apache2.conf`:

```ApacheConf
# pipes websocket traffic for roggle to node
ProxyPass "ws://nathanfriend.io:18734/roggle/server" ws://localhost:18734/
ProxyPassReverse "ws://nathanfriend.io:18734/roggle/server" ws://localhost:18734/
```

### Update

The live version of Roggle is no longer hosted behind Apache; leaving the info
above for historical purposes.
