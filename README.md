<h1 align="center">
    <a href="https://github.com/pnotato/VisuDocs">
        <img src="./client/public/icons/icon.png" valign="middle" width="58" height="58" alt="VisuDocs" />
    </a>
    <span valign="middle">
        VisuDocs
    </span>
</h1>

A collaborative, real-time code editor with support for multi-user editing. Similar to Google Docs, VisuDocs is a code editor that uses websockets to support multiple users working on the same code. 

# Tech Stack

*Frontend:* Built with React and TailwindCSS. Uses the [Monaco code editor](https://github.com/microsoft/monaco-editor) for the main editor functionality, and [Piston](https://github.com/engineer-man/piston) to run the code itself. 

*Backend:* Built with Express and Node.js, using Socket.io to handle multi-user and chat functionality. The code data for the projects themselves are stored in MongoDB, with Redis used as an in-memory cache to sync code and messages effectively.

*Auth/Security:* Uses MongoDB. Supports sign-in/sign-up with email or with Google via Firebase, secured with JSON Web Tokens (JWT) and cookie-based sessions.


### UI Screenshots

![VisuDocs Editor](./documentation/images/editor.jpeg)

![VisuDocs Dashboard](./documentation/images/dashboard.jpeg)

### Video Demo

![](./documentation/demo-video.mp4)

# Usage

```git clone``` the repository and install the dependencies
```
git clone https://github.com/pnotato/VisuDocs
cd VisuDocs
npm i
```

You will need to create a ```.env``` file in the root directory with the following variables:
```
MONGODB_KEY=<a mongodb url>
JWT = <any string, will be used for json web token signing>
VITE_FIREBASE_KEY=<firebase api key>
```
Start the frontend by running ```npm run dev``` and backend with ```node server.js```. The app should start running on [http://localhost:5173/](http://localhost:5173/)

You can also enable server updates by running the ```--log``` flag when running ```server.js```
```
$ nodemon server.js --log
[nodemon] starting `node server.js --log`

[server.js] Verbose Mode -- Server updates are logged.
[server.js] Express server initialized :)
[server.js] Connected to MongoDB :)
[server.js] Websocket server initialized :)
[server.js] Redis client initialized :)
[server.js] Server running on port 3000 :)
```


