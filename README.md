# Video.js Simple Prerolls

Simple video.js plugin that uses the video.js' [videojs-contrib-ads](https://github.com/videojs/videojs-contrib-ads) plugin to display a preroll video before the main video starts.

## Adding the plugin

Download the [videojs-contrib-ads](https://raw.githubusercontent.com/videojs/videojs-contrib-ads/master/src/videojs.ads.js) plugin or [build it yourself](https://github.com/videojs/videojs-contrib-ads) from the repository. Include videojs.ads.js and videojs-preroll after including video.js itself.

```html
<script src="video.js"></script>
<script src="videojs.ads.js"></script>
<script src="videojs-preroll.js"></script>
<link href="video-js.css" rel="stylesheet" type="text/css">
<link href="video.ads.css" rel="stylesheet" type="text/css">
<link href="videojs-preroll.css" rel="stylesheet" type="text/css">
```

Initialize the plugin:

```html
<video id="example_video_1" class="video-js vjs-default-skin" controls width="640" height="264" poster="http://video-js.zencoder.com/oceans-clip.png">
  <source src="http://video-js.zencoder.com/oceans-clip.mp4" type='video/mp4' />
  <source src="http://video-js.zencoder.com/oceans-clip.webm" type='video/webm' />
  <source src="http://video-js.zencoder.com/oceans-clip.ogv" type='video/ogg' />
</video>
<script>
videojs('example_video_1', {plugins:{ads:{},preroll:{src:"advertisement.mp4"}}});
</script>
```

There's also a [working example](example.html) of the plugin you can check out if you're having trouble.

## Documentation
### Plugin Options

You may pass in an options object to the plugin upon initialization. This
object may contain any of the following properties:

#### src
Type: `String`

`Required`. Source video file to play

#### href
Type: `String`

Url to redirect to if user clicks on the ad. Can be left empty for no redirection.

#### target
Type: `String`
Default: _blank

Target to open the url in (eg _blank or _top)

#### allowSkip
Type: `Boolean`
Default: true

Allow the user to skip the ad when it has played for a number of seconds

#### skipTime
Type: `Integer`
Default: 5

Number of seconds after which the video can be skipped

#### repeatAd
Type: `Boolean`
Default: false

Whether the ad should be repeated if a new src is loaded to the player

## Credits

Uses javascript and css for video skipping and linking block from The Onions [videojs-vast-plugin](https://github.com/theonion/videojs-vast-plugin/)

## Release History

###v0.2.0
- Updated videojs-contrib-ads library to v0.5.0 and made the preroll plugin compatible with it
- Fixed some of the loading events to start playback faster if there is no ad to be displayed
###v0.1.0
- Initial release

## License

MIT
