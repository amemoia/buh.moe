---
title: "Markdown made me nuke my website for the 7th time"
description: "basically how I set up this blog"
pubDate: 2024-08-27
tags: ['astro', 'yapping']
---

**I LOVE MARKDOWN!!** It's very fun to use and makes text formatting *super easy*, regardless of length or application.

As I thought about setting up a blog on my personal website, I got very excited by the idea of using it as the format to write my posts in. Unfortunately for me, my initial attempts at getting this to work made me realize that this **won't** be a simple 1-day project as I had hoped.

## The problem

I was initially going to implement this on my *Needy Streamer Overload* themed site. This very quickly proved to be a problem for me as the website is pretty hard to work with, and the blog posts I did manage to set up did not look good at all. I hoped to replace this site for a while now, even though it might be the best design I ever managed to pull off and it helped me meet many cool people simply by having it in my Discord profile (it even landed me a [Deadlock](https://store.steampowered.com/app/1422450/Deadlock/) invite ;3)

Implementing a blog on this site would also be quite difficult due to the fact that I'd have to manually set up a way to translate Markdown files to HTML in a way that supports frontmatter. I did try a few solutions, but they didn't work the way I wanted them to and I quickly realized that I was wasting my time - I needed to redo my website to support my blog in a way that looks good and runs well.

## Finding a solution

I decided to take a step back and research Markdown based software and websites in general to see how they look and work. I sometimes use [Obsidian](https://obsidian.md/) for taking notes, making checklists and the like. It uses Markdown files and fully supports frontmatter through [Properties](https://help.obsidian.md/Editing+and+formatting/Properties).

![Properties in Obsidian](<../img/blog/Obsidian Properties.png>)
<sub>Properties in Obsidian</sub>

Obsidian also has a paid service called [Obsidian Publish](https://obsidian.md/publish) which creates functional websites from your Markdown files. Researching this made me realize that many static site generators straight up support Markdown, and I am incredibly stupid for trying to do this by myself in raw JavaScript. You could say this was the final nail in the coffin for my NSO site. By the next day I had a website built in [Astro](https://astro.build/) mostly ready, paired with a design that I really like.

## Some closing thoughts on Astro

Honestly, I didn't expect to have so much fun using it! Their tutorial had nearly everything I needed and [Components](https://docs.astro.build/en/basics/astro-components/) might just be one of my favorite features in it. I had a little bit of trouble getting Twemoji set up *(thanks, Elon)* but most of that was me not knowing about Astro's inline scripts. I used FontAwesome for the icons and had to use a workaround I found for the ko-fi logo, which FontAwesome refuses to add for some reason.

Another issue I had was that the Dark Reader extension made switching through pages really jarring for some reason? Honestly, I don't use it all that much so I just removed it from my browser. Can't be bothered to deal with that right now */shrug*

Because this was my first time using a static site generator and NodeJS in general, I switched from [Nekoweb](https://nekoweb.org/) in favor of [GitHub Pages](https://github.io) for a bit. Theoretically, Nekoweb *does* support static site generators through using the *NekoVM* terminal, but I decided to leave that for another time.

Honestly, I'm really proud of this website. Making it was very fun, it supports both light and dark modes based on your system theme, it has an RSS feed for the blog, the overall look is one of my best and it doesn't feel like it will fall apart at any second anymore. Thanks Astro for making this possible~!

---

Allow me to express my gratitude if you read this far! I know my yapping probably wasn't very interesting, but I needed a blog post to test on and since making this site was a whole journey in itself, the length of it got kinda... out of hand. As a form of thanks you can have this super cool gif.

![buhOverShakeyFlipExplode.gif](<../img/blog/buhOverShakeyFlipExplode.gif>)
<sub>buhOverShakeyFlipExplode.gif</sub>