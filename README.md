# Focused Youtube <a href="https://chromewebstore.google.com/detail/strict-focused-youtube/behjadmmpafnpaeijfoioegdpcbpbhij"><img width="124" alt="Add to Chrome" src="https://user-images.githubusercontent.com/768070/113516074-a1513500-9578-11eb-9eb9-06326003cf66.png"></a>

Thank you to [makaroni4/focused_youtube](https://github.com/makaroni4/focused_youtube) for the base extension!

:mag: **Focused Youtube** (FY) is a Chrome Extension that helps you stay focused by blocking recommendations and other elements on Youtube.

:heart: FY **does not track any user data**. It's a simple Vanilla JS application made with only one purpose – to help you avoid Youtube's rabbit hole.

:sparkles: **Changes from upstream:**
- [category enforcement](#-category-enforcement)
- subscribe to playlists ([`app.js:initSubscriptions`](https://github.com/EthanDawes/focused_youtube/blob/main/main/js/app.js#:~:text=const%20playlists%20=%20[))
- desaturate thumbnails
- Show only first 2 comments
- Only allow videos and playlist tabs on channel pages
- Redirect shorts to their video equivilent (thus no infinite scroll)
- [always keep enabled](https://github.com/funblaster22/focused_youtube/tree/main/watchdog-ext)
- Block videos from known problematic channels that I waste time on and regret ([`app.js:isBannedChannel`](https://github.com/EthanDawes/focused_youtube/blob/main/main/js/app.js#:~:text=function%20isBannedChannel()%20{))

There is a notable lack of GUI customization options because this is customized to suit my needs and intended for a developer audience. If it really gains traction I might consider it.

## Screenshots

### 🔍🏠 Searching and homepage disabled

### 📺 Noise-free video page.

<img width="800" alt="video_page" src="https://user-images.githubusercontent.com/768070/134961989-6673499b-311f-4334-825b-815b66446fd1.png">

### 🙅 Category enforcement
Disallow watching videos from hard-coded categories ([`app.js:checkVidCat`](https://github.com/EthanDawes/focused_youtube/blob/main/main/js/app.js#:~:text=function%20checkVidCat()%20{)). If the video was misclassified, you can type in the correct category. This frequently changes.

<img width="800" alt="video_page" src="https://user-images.githubusercontent.com/53224922/205467755-a83d01f9-d64c-437f-b4c5-55e8e4b4ebab.png">

## Development

Clone FY's repo to your computer.

Load the repo to [chrome://extensions/](chrome://extensions/) via "Load unpacked":

<img width="611" alt="update_extension" src="https://user-images.githubusercontent.com/768070/134963200-aaf3241a-522a-4079-a416-a1b58811a97c.png">

:mag: You'll need to update extension :point_up: every time you changed CSS/JS files.
