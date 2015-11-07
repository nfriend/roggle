# roggle
A multiplayer Boggle clone, built with React and TypeScript.

#### Note to self

In order to run the node websocket server on the same server as apache, add this to `/etc/apache2/apache2.conf`:

```ApacheConf
# pipes websocket traffic for roggle to node
ProxyPass "ws://nathanfriend.io:18734/roggle/server" ws://localhost:18734/
ProxyPassReverse "ws://nathanfriend.io:18734/roggle/server" ws://localhost:18734/
```