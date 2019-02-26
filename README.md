# in-our-tea-time

A record of which beverage guests request at the end of each BBC Radio 4 "In Our Time" podcast.

## Episode categories

RSS feeds are available that split the episodes by category:

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

### Process next podcast from feed list

Download and clip the last 30 seconds of a podcast and store a record of having processed it:

```bsh
node processNextPodcast.js
```

### Processing with Have On Demand

curl -X POST http://api.havenondemand.com/1/api/async/recognizespeech/v2 --form "language_model=en-US" --form "file=@p06lnkbr_end.mp3" --form "apikey=75deba39-4b9a-43a9-bce3-f7a6c274974b"
