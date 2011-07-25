INSTALL
=======

You need to install nodejs and ought to install npm.

node: http://nodejs.org/
npm: http://npmjs.org/

All node dependencies are listed (some with loose versions) in package.json. The packages should be able to be required without installing via npm since they're checked in under ./node_modules/ and that path is unshifted into load paths. If not, give it the old `npm install`. 

To run the app, you'll need the foreman gem (yeah, it's weird that it's a gem, but it's how github suggests running it locally) then just do `foreman start` and open localhost:5000 (or whatever port it says). Try opening it in different browsers/tabs and seeing the websockets magic in action.

Also, this now works on heroku. Just run something like the following commands to get it up and running: (will make a raketask for this soon)

heroku create --stack cedar
git push heroku master
heroku ps:scale web=1
heroku logs (look for "State changed from starting to up" at the end)
heroku open (or just go to the url in your web browser from the output of those commands)

Note: I'm not currently able to see other players in the game (on local or heroku) but it may very well be due to the changes I made to get it running for me locally and on heroku.

Needless to say, there are probable 2 billion bugs in this code.. but it's just a draft to look into the possibilities of node,socket.io and crafty in general.
