---
title: "alex buh's PC essentials + degoogle"
description: "i hate everything"
date: 2025-09-06
tags: ['pc', 'windows', 'degoogle']
---

I'm very particular about the way I set up my devices. This article serves as a quick list of things I do to set up my PC, as well as a list of software I use. Mostly intended as my own sort of checklist, but I also thought it'd be fun to share.

# OS Setup and Partitioning

My PC currently has a 1TB SSD and 1TB HDD. Any OSes I install have a small partition on the SSD, with the rest of the space along with the whole HDD being shared across systems. My PC doesn't play nice with Linux, so I am unfortunately forced to stick with Windows for the best performance.

For Windows, I'd allocate 150-200GB. On Linux you can probably get away with less.

## Activating and Optimizing Windows

easy windows free hack 2008 no virus

```ps1
irm "https://get.activated.win" | iex
```

I always optimize my Windows installs with [Chris Titus Tech's Windows Utility](https://github.com/ChrisTitusTech/winutil)

```ps1
irm "https://christitus.com/win" | iex
```

I recommend doing this on any and all installs. It's the easiest way to disable Windows telemetry and install software you need. It also allows you to delay Windows Updates, so you don't end up in a situation where Microsoft ruins your SSD because of a bad update that installed on it's own.

If that's not enough, a last resort I use to squeeze out the last bits of performance out of my computer is [AtlasOS](https://atlasos.net/) (NOTE: I don't recommend using Windows mods such as these on modern hardware, you don't really need it)

## Library folders

I always recommend relocating all library folders (Downloads, Documents etc) to a partition other than the OS partition. This way, any OS reinstall will not wipe these folders and they can be shared across OSes. This can be done in Windows by going into the properties panel of each folder, going to the Location tab and setting it there. For some reason I rarely see this mentioned even though the convenience it provides is huge.

# Software

I'm not much of a fan of Linux and I'm no privacy freak either, so in my recommendations I'll do my best to give other cool reasons to use the software I list. My main goal with my choices is to avoid companies I dislike (such as Google) while also making it easy to sync across devices.

## [Zen - Web Browser](https://zen-browser.app/)
I dislike any Firefox based browsers, but recent news of Google making deals with Israel led me to switch off of Chrome and Google Search. Zen seeks to scratch the itch that Arc left behind and does so without all the performance issues. Somehow, despite being in beta, Zen is less buggy than Arc was after full release. It's still missing some features, but hopefully those will be remedied. My biggest gripe with Zen as of writing, is that workspaces are not synced by default, and syncing pinned tabs in the workspaces is impossible altogether. Really hoping that this will be added in the future.

Extensions I recommend:
- [uBlock Origin](https://ublockorigin.com/)
- [7TV](https://7tv.app/)
- [PronounDB](https://pronoundb.org/)
- [SteamDB](https://steamdb.info/extension/)
- [SponsorBlock for YouTube](https://sponsor.ajay.app/)
- [Control Panel for YouTube](https://soitis.dev/control-panel-for-youtube)
- [Control Panel for Twitter](https://soitis.dev/control-panel-for-twitter)

## [DuckDuckGo - Search Engine](https://duckduckgo.com/)
As I said, I'm no privacy freak, so DuckDuckGo generally does not appeal to me (especially since it relies on Bing for search results), but when switching off of Google this was the first thing that came to mind. I was pleasantly surprised to find some features I really wished were added to Google! DuckDuckGo allows you to filter AI images from search results, all AI features are optional and they let you straight up remove ads and privacy reports, very cool! I love how customizable it is.

## [Cider - Apple Music Client](https://cider.sh/)
I'm very unsatisfied with Spotify and my frustration reached a boiling point when their "Smart Shuffle" feature nuked all local files from my playlist without warning. Apple Music offers very competitive pricing ESPECIALLY if you're a student, treats your local files properly and in my opinion their audio quality is much better than Spotify's. They are also rolling out a feature that lets you easily transfer your playlists from another service to Apple Music. My only complaint is their weird Windows client, which you can get around using Cider - a community-made Apple Music client for Windows, Linux and MacOS. It's highly customizable and adds many features like Discord Rich Presence. I still find myself coming back to the official client from time to time for features like Dolby Atmos, but it's my understanding that Cider's developer is working on these issues.

## [Obsidian - Notes](https://obsidian.md/)
Obsidian is a heavily customizable notes app, where notes are all markdown files. While there are a lot of community plugins and themes available, I found myself mostly choosing to stick to the basic Obsidian experience. The UI on mobile is a bit janky and you'll either have to pay for the official Sync or use one of the available free community sync plugins. Other than that I think the app is very great and I use it for university, plus a Deadlock lore vault that I occasionally work on.

## [Raycast - Spotlight-style command palette](https://www.raycast.com/)
Raycast is a Spotlight Search replacement for macOS that is now in Beta on Windows. It's essentially a command palette merged with app and file search. Honestly, if I could I would just completely replace the Start menu with this. It's very customizable and offers community plugins, you can have utilities like calculator, IP information, speedtest etc one shortcut away.

### Other Essentials
- [Discord](https://discord.com/) w/ [Vencord](https://vencord.dev/) (or [Vesktop](https://github.com/Vencord/Vesktop))
- [Steam](https://store.steampowered.com/about/download)
- [ShareX](https://getsharex.com/)
- [qBitTorrent](https://www.qbittorrent.org/)
- [LocalSend](https://localsend.org/)
- [7Zip](https://7-zip.org/download.html) / [WinRAR](https://www.win-rar.com/start.html?&L=0)
- [Notepad++](https://notepad-plus-plus.org/downloads/)

### Specific
- [Paint.NET](https://www.getpaint.net/download.html)
- [VS Code](https://code.visualstudio.com/download)
- [GitHub Desktop](https://desktop.github.com/download/)
- [DS4Windows](https://github.com/Ryochan7/DS4Windows)
- [Parsec](https://parsec.app/downloads)
- [Stremio](https://www.stremio.com/)
- [XIVLauncher for Final Fantasy XIV](https://goatcorp.github.io/)
- [Prism Launcher for Minecraft](https://prismlauncher.org/)
- [Source 2 Viewer](https://s2v.app/)
- [Windows 11 Style Cursors (Tail)](https://www.deviantart.com/jepricreations/art/Windows-11-Tail-Cursor-Concept-Free-962242647) or [(Tailless)](https://www.deviantart.com/jepricreations/art/Windows-11-Cursors-Concept-886489356)

<hr>

I recommend self-hosting the services listed below if you are able. Even if you buy a domain, assuming you have a spare laptop lying around and can get a static IP address, setting these up on your own will be significantly cheaper (and more fun!). That being said, I don't have anything to host these on, so here are the services I use instead.

## [Proton Pass - Password Manager and Authenticator](https://proton.me/pass)
Proton's password manager is crazy good even on it's free plan. If you need an authenticator on top of that, you can either pay for Proton Pass to integrate it with your logins OR use [Proton Authenticator](https://proton.me/authenticator), which is completely free and syncs to your Proton account.

## Other Proton Software - Mail, Calendar, Drive, Docs, VPN, Crypto Wallet
I use [Proton Unlimited](https://proton.me/pricing), which includes the premium versions of Mail, Calendar, Pass, Drive, VPN, Wallet with 500GB of storage to use across these services. I'd still rather selfhost these, but Proton has left me with very little complaints and I think their password manager is very neat and user friendly, which I value a lot. I also appreciate that they offer installable Mail+Calendar clients. Despite not using VPN and Wallet, I think Proton offers a great deal at just 13 EUR a month, which I got down to under 10 EUR thanks to regional pricing on the App Store.

My only complaint with Proton is that there is a lack of feature parity between some platforms (macOS seems to be far behind when it comes to Drive) and backing up to Drive can take a while if you have a lot of small files such as photos.

### buh's full degoogle list
- Browser: [Zen](https://zen-browser.app/)
- Search: [DuckDuckGo](https://duckduckgo.com/)
- Notes: [Obsidian](https://obsidian.md/)
- Mail: [Proton Mail](https://proton.me/mail)
- Calendar: [Proton Calendar](https://proton.me/calendar)
- Cloud Storage: [Proton Drive](https://proton.me/drive)
- Photos: [Proton Drive](https://proton.me/drive)
- Password Manager: [Proton Pass](https://proton.me/pass)
- Authenticator: [Proton Pass](https://proton.me/pass)
- VPN: [Proton VPN](https://proton.me/vpn)
- Music: [Apple Music](https://www.apple.com/apple-music/)
- Maps: Google Maps is sadly hard not to use. I use [Waze](https://www.waze.com/) for navigation, but that's also owned by Google.

<hr>

That's about it for my PC setup checklist and software recommendations. I might update this in the future if I ever find new things I start to consider essential. Until then, thanks for reading!