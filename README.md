# foodtruck-homework
MVP Command line interface:
- parse CSV of San Francisco Foodtrucks
- load parsed CSV into memory
- take in a point of lat/lon
- spin through in memory list and calculate distance to each foodtruck
- return top 5 ordered by closest to furthest distance

Backlog:
1. take your location from command line as lat/lon
1. time how long it take to produce result
1. take your location as a freeform text to lookup on google maps api and pick first best closest (traps: have to have interactive confirmation if not high confidence in lookup)
1. take your location frmo the moral equivalent of ifconfig.co iplookup of your machine as the default (traps: makes no sense when a person is VPN-ed or in many corporate situations)
1. ask os for machine's best guess of your location (traps: platform specific/requires security popup?)
1. download latest data from actual url of san fran publish service
1. cache data downloaded from san fran public service to reduce load on external service and reduce latency (trap: expiration policy, multiple verions, etc.)
1. make this a web service
1. measure latency of each call, total calls, and capacity of a server (cpu/disk/network in basic metrics to see what is maxed first to understand where the bottlenexks are - on the client, on the centralized store, etc.
1. if data is large - or we take on many markets or we percieve there is perf issue push this up: move data to a indexed store with geelocation query support (mongodb, elastic) or at least make a cubset of the fields from the csv (i.e. an index/rownumber + lat + lon and use that to augment with distance and do the sort - less memory pushed around)
1. if still caching a startup set of data locally, notify each instance of a change to data if redownloaded (trap: chatty heartbeat from stateless / connectionless clients, or connected client overhead of open connection)
1. provide front end website that allows google search/scroll/point to set location for distance query
1. are there other aspects that should taint/change the order?  (paid ad, previous bad reviews, match of taste preference to the user - allow oauth and pull what is relevant from facebook - makes you lean toward some Information retrieval backend = elastic/lucene or similar)
1. host web service behind cloud endpoint manager that allows scale up / down based on traffic
1. host front end website in something that allows auto scale based on traffic

