node-sentinel-redis
===================

Redis Watchtower

This is an initial setup of tracking actions/events triggered by redis sentinels.

SOFTWARE:

node v0.8.21, node_redis v0.8.2, redis v2.6.10

SCOPE:

Server Infrastructure. Follow up Redis Crosslinks.

STYLE:

Bottom Up. Minimized Parameter Usage and Error Handling. 

STATUS:

Initialization. Console.log

TEST:

Initial Test 1 (manually)

Configure/Start 3 redis procs: 1xSentinel, 1xMaster, 1xSlave

Configure tracksen.js

   Set Port/IP of sentinel: var sentinels1 = { 26379:"127.0.0.1" }

   Fill up: var sents (copy/paste line sentinels1,sentinels1 ...

   ... the line has ten sentinels1 entries ...

   ... copy the line nine times --> now 100 entries ...

   ... copy the block nine times --> now 1000 entries)

Thousand connections are designated, tracksen and sentinel have something to work on.
  
Start trackdog

$ node tracksen.js

Provoke impact

Stop .... Master

Result: tracksen receives full subscriptions from 1000 sentinels, a single sentinel submitts these...

... in other words: a sentinel scatters full subscriptions to 1000 tracksens, a single tracksen gathers these.

Things are shaping up well.

NEXT:

Auto-generate test environment.

Determine performance limits.

Check up master/slave takeover breakdown actions.

FUTURE:

Merge metameric probes into bricks precisely adjusted to continue event usage.


++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

ABSOLUTE FREE SOURCE 

DISCLAIMER

The Source Code is provided on an “as is” basis, without warranty of any kind.

Use on your own risk!

