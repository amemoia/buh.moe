While the Yakuza / Like a Dragon series does not have official Linux / Mac ports, Windows compatiblity layers such as Wine make it possible to play the entire series on non-Windows devices.

On Mac, a few caveats are involved, but overall the series runs quite well even on my M2 MacBook Air, which needs additional compatibility layers to run the games on it's ARM processor.

This article will serve as a short but comprehensive guide to getting all current Yakuza titles running on Mac.

# Prerequisites

This guide will use a piece of software called CrossOver. The latest versions require macOS Sequoia (15), but older ones go back as far as macOS Mojave (10.14). This is essentially Wine with a bunch of game-specific patches that aren't entirely ready to be included in Wine yet.

CrossOver is paid software, but a large majority of it's code is released back into Wine and Proton. CodeWeavers - the developers of CrossOver - are sponsors of Wine and actively provide their patches to the project for everyone's benefit. If you can afford it's hefty $70+ price tag, I encourage you to buy a license. Since it's quite expensive though, and it's hard to avoid running Windows software at times, I wouldn't blame you for resorting to piracy. I don't want to get into trouble, so I won't be going into how to get a cracked copy in this guide.

I'd also like to set some expectations regarding performance. While the games are playable, keep in mind that you will be running them through MULTIPLE compatibility layers, especially if you're on an ARM processor like Apple's M-series.

Additionally, I highly recommend playing these games with a controller. Your Mac will get hot, Air models will thermal throttle (which lowers performance so your laptop doesn't overheat) and the touchpad generally isn't the best fit for this game's default controls.

*This guide will be using CrossOver version 25.*

# Setting up a Bottle

The easiest way to get started is to set up a Steam bottle. CrossOver includes easy ways to install software and all depenencies within it's client. Simply click Install in the bottom of the sidebar and search for Steam. CrossOvers should automatically create a bottle. If you're not familiar with Wine, a bottle is basically a fake Windows environment.

Some games require something called AVX. Starting with CrossOver version 25, this should automatically enable for games that require it. 