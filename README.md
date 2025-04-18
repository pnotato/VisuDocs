<h1 align="center">
    <a href="https://github.com/pnotato/VisuDocs">
        <img src="./public/icons/icon.png" valign="middle" width="58" height="58" alt="engineer-man piston" />
    </a>
    <span valign="middle">
        VisuDocs
    </span>
</h1>



<div align="center">
  <a href="https://www.youtube.com/watch?v=pAY6s_Z3O5Q" target="_blank">
    <img src="./documentation/images/landing.png" style="width: 100%; max-width: 900px;"/>
  </a>
</div>

A code editor that functions similar to Google Docs. Allows for multiple users to work on the same project at once. Video demo can be found [here](https://www.youtube.com/watch?v=pAY6s_Z3O5Q).

# Tech Stack

**Frontend:** Built with React and TailwindCSS. Uses the [Monaco code editor](https://github.com/microsoft/monaco-editor) for the main editor functionality, and [Piston](https://github.com/engineer-man/piston) to run the code itself. 

**Backend:** Built with Express and Node.js, using Socket.io to handle multi-user and chat functionality. The code data for the projects themselves are stored in MongoDB, with Redis used as an in-memory cache to sync code and messages effectively.

**Auth/Security:** Uses MongoDB. Supports sign-in/sign-up with email or with Google via Firebase, secured with JSON Web Tokens (JWT) and cookie-based sessions.

# UI Screenshots

<div align="center">
  <img src="./documentation/images/editor.jpeg" style="width: 100%; max-width: 900px;"/>
</div>

<br/>

<div align="center">
  <img src="./documentation/images/dashboard.jpeg" style="width: 100%; max-width: 900px;"/>
</div>

<br/>

# Usage

```git clone``` the repository and install the dependencies.
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
```shell
$ nodemon server.js --log
[nodemon] starting `node server.js --log`

[server.js] Verbose Mode -- Server updates are logged.
[server.js] Express server initialized :)
[server.js] Connected to MongoDB :)
[server.js] Websocket server initialized :)
[server.js] Redis client initialized :)
[server.js] Server running on port 3000 :)
```
# Notes

- The editor colour scheme will appear slightly off on HDR-enabled displays. This is due to how the monaco theming is configured and will hopefully be fixed soon.
- Demo coming soon!

