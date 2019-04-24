# Spectre

Electron component to a desktop overlay mod that allows other users to control "flashlights" on the screen. Playful experiment about the involvement of spectators seeing.

![Spectre Mod Clip](/spectre.gif)

## Installation 🔨

This is the desktop client portion of spectre. Make sure to also install the server and web client component [here](https://github.com/jynnie/spectre-web).

```
# install dependencies
$ npm install
```

To connect to a server, create `config.js` and set `SERVER_URL` to your server URL. There's an `example.config.js` for reference.

## Usage 🔦

```
# run the electron app
$ npm start
```

Resize the application to cover your whole screen. In the top right corner, if the app has connected to the server, a room code will appear there. If it has not connected, the code displayed will be 0000. Web clients can then connect to the server, enter the room code, and use the mouse pad area to control a light circle.

To change brightness and circle size settings, press `esc` to toggle the settings modal. To enable cheat mode, type `666` >:)

App should be draggable from the top bar of the app and should turn white on hover.

## Why did you make this? 👀

I developed this as part of a project to experiment with how spectators (spectres) can be recognized and play in the game space. What better way to highlight what spectators do then by *highlighting* what they see? Inspired by _Hidden Agenda_ and the flashlight mod in _osu!_, we have Spectre.

### List of Features in Consideration ⏲

* Different shapes
* Participant max, lottery system for active

## Contributing 🙌

To suggest features or report bugs, create a [Github issue](https://github.com/jynnie/spectre-app). Want to chat or ask questions? Join the [Discord](https://discord.com/invite/UwYRv3h).

## License 🔎
[CC-BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/) @ [jynnie](https://github.com/jynnie)
