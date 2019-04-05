# Spectre

Electron component to a desktop overlay mod that allows other users to control "flashlights" on the screen. Playful experiment about the involvement of spectators seeing.

Somehow, our [first clip](https://clips.twitch.tv/HomelyAssiduousQueleaSoonerLater) went kind of viral.

## Installation 🔨

This is the desktop client portion of spectre. Checkout the server and web client component [here](https://github.com/jynnie/spectre-web).

```
# install dependencies
$ npm install
# run the electron app
$ npm start
```

## Usage 🔦

Resize the application to cover your whole screen. In the top right corner, if the app has connected to the server, a room code will appear there. Web clients can then connect to the server, enter the room code, and use the mouse pad area to control a light circle.

To change brightness and circle size settings, make sure you're focused on the app:
* Press 1 to enter necessary mode (0.98 opacity)
* Press 2 to enter beneficial mode (0.65 opacity)
* Press 9 for larger circles
* Press 0 for smaller circles
* Type 666 to enter cheat mode >:)

## Why did you make this? 👀

I developed this as part of a project to experiment with how spectators (spectres) can be recognized and play in the game space. What better way to highlight what spectators do then by *highlighting* what they see? Inspired by _Hidden Agenda_ and the flashlight mod in _Osu_, we have Spectre.

### List of Features in Consideration ⏲

* Settings modal for more fine control of brightness and circle size
* Different shapes
* Participant max, lottery system for active

## Contributing 🙌

To suggest features or report bugs, create a [Github issue](https://github.com/jynnie/spectre-app).

## License 🔎
[CC-BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/) @ [jynnie](https://github.com/jynnie)