# SameGame

About 10 years ago (2008), I was bored one night and threw together a quick implementation of <a href="https://en.wikipedia.org/wiki/SameGame">SameGame</a>. It's a tile-matching puzzle game I played (way too much) on Windows 95.

The code is... rough. But the game is playable. I found it recently and thought it might be fun to revisit and refactor a little.

> Side note: I don't know the exact date I wrote the code. The file modification date isn't correct. However, I can "carbon date" the file to early 2008 based on the jQuery version. The game used version 1.2.3, which was [released](https://blog.jquery.com/2008/02/07/jquery-1-2-3-released/) on Feb. 7, 2008. The next version was [released](http://blog.jquery.com/2008/05/20/jquery-1-2-4-released/) on May 20, 2008.

## Refactoring log:

Well, let's get started
- Clean up HTML with some basic HTML5
- Move the CSS and JS into their own files
- Run [standard](https://standardjs.com/) on the JS to save time
- Get to zero warnings in WebStorm
