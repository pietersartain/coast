# coast - an IRC client in the shape of Slack

As an exercise in playing with Javascript and Node, this is (the start of) an aesthetic clone of Slack, but in IRC client form.

This is based off [Electron](http://electron.atom.io), using [KnockoutJS](http://knockoutjs.com/).

## Minimum viable Slack

Servers

 + ~~Can configure server (server name, address, user name)~~
 + ~~Configured servers are saved~~
 + ~~Can connect to more than one server at a time~~
 + Currently selected server is displayed
 + Servers with unread messages are highlighted
 + MVP only needs one server

Channels

 + Can show list of channels to join
 + ~~Can join existing channels~~
 + ~~Can create new channels~~
 + ~~Can select a channel~~
 + ~~Can send/receive messages per channel~~
 + ~~Can visually see which channel I"m currently in~~
 + ~~Channels with unread messages in are highlighted~~
 + Can see who is in the current channel
 + ~~Get notices when people join or leave a channel~~
 + Can see the channel topic
 + Can see the number of people in a channel
 + Can leave a channel

Users

 + Can show a list of users to start a conversation with
 + Can close/leave a conversation
 + ~~Can send/receive DMs~~
 + ~~Can visually see if new DMs arrive~~

Slack-specific USPs:

 + ~~Bundles messages by author (3 minute timeout, doesn't refresh)~~
 + Message history (within IRC confines)
 + Reactions / custom emoji
 + Clickable links (probably with inline cards)
 + Message pinning
 + Message sharing (with inline cards)
 + User icons

## To Use / Dev on

(Instructions borrowed from Electron)

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/pietersartain/coast
# Go into the repository
cd coast
# Install dependencies and run the app
npm install && npm start
```

#### License [GPLv3](LICENSE.md)
