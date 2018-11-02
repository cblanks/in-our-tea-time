# in-our-tea-time

A record of which beverage guests request at the end of each BBC "In Our Time" podcast.

## Episode categories

- [Culture](http://podcasts.files.bbci.co.uk/p01drwny.rss)
- [History](http://podcasts.files.bbci.co.uk/p01dh5yg.rss)
- [Philosophy](http://podcasts.files.bbci.co.uk/p01f0vzr.rss)
- [Religion](http://podcasts.files.bbci.co.uk/p01gvqlg.rss)
- [Science](http://podcasts.files.bbci.co.uk/p01gyd7j.rss)

## Process

### Summarize feed info

Access RSS feeds to create summary local json files:

```bsh
node getFeedSummary.js
```

### Store audio clips

Download and clip the last 30 seconds of a podcast:

```bsh
node clipAudioFile.js
```
