
# Blocks of little weird layouty bits

For when clients want weird little designs in their site.

The blocks are in src/blocks. (There's currently only one, it might stay this way forever.) Each has the following files:
- block.js: registers the block
- block.php: registers the block in php and handles server side rendering
- component.jsx: the component used in edit when registering the block in block.js and also used as a template for the server side render (after a bit of regex)
- editor.scss: editor specific scss that gets magically transformed by the wonderful Create Guten Block script
- style.scss: styles loaded on front and back end, same magic as above

You shouldn't need to run npm install to make this work, I've included all the necessary scripts.

NB: This isn't for production use at all, it's not responsive for one thing and there are many others. This is mainly
1. to show how Gutenberg will make editing easier compared to metaboxes
2. for me to try out a certain way of making blocks (server side render with React Component used in both editor and, with a bit of regex, in php render function)

--- 

## Blocks

### circle-text
For when your client wants to put three red circles with text and links on random pages as callouts. The hover should be pink.

![Screenshot](https://raw.githubusercontent.com/tharsheblows/mjj-why/master/src/blocks/circle-text/circle-text.png) 

### github-gist
This is [Daniel Bachhuber's Github Gist block](https://github.com/pantheon-systems/github-gist-gutenberg-block), almost. ~~I rewrote it in ES6 and it doesn't work as well. It doesn't update except when the block is unselected — you type in the url of a gist then have to unselect it for the gist to show up) whereas Daniel's does this as soon as the url is entered. I'm assuming I've missed out something basic, who knows? Not me.~~ Is it still better than using a metabox or shortcode though? I'm going with yes. (But if you are thinking "No, no it is not" then it's still ok, this gives you a shortcode you can use to do the same thing.)

edit a bit later: I ended up fixing the issues I was having. [This by Igor Benić](https://www.ibenic.com/create-gutenberg-block-displaying-post/) was super helpful in getting my head around how to handle state. I also needed to use the setState callback to set the attributes properly — they were one step behind. [This was helpful in understanding that](https://medium.learnreact.com/setstate-takes-a-callback-1f71ad5d2296). And, stupidly, I had forgotten that I needed to call componentDidUpdate to, y'know, keep it updated.

All in all, I *highly* recommend doing something similar to learn bits and pieces of anything. I asked Daniel if it was ok if I just copied and pasted some of his code and he was lovely about it. It helped to know where I wanted to go when figuring out how to get there. :) 

![Screenshot](https://raw.githubusercontent.com/tharsheblows/mjj-why/master/src/blocks/github-gist/github-gist.png) 

---

This project was bootstrapped with [Create Guten Block](https://github.com/ahmadawais/create-guten-block).

Below you will find some information on how to run scripts.

>You can find the most recent version of this guide [here](https://github.com/ahmadawais/create-guten-block).

## 👉  `npm start`
- Use to compile and run the block in development mode.
- Watches for any changes and reports back any errors in your code.

## 👉  `npm run build`
- Use to build production code for your block inside `dist` folder.
- Runs once and reports back the gzip file sizes of the produced code.

## 👉  `npm run eject`
- Use to eject your plugin out of `create-guten-block`.
- Provides all the configurations so you can customize the project as you want.
- It's a one-way street, `eject` and you have to maintain everything yourself.
- You don't normally have to `eject` a project because by ejecting you lose the connection with `create-guten-block` and from there onwards you have to update and maintain all the dependencies on your own.

Create Guten Block is by [@MrAhmadAwais](https://twitter.com/mrahmadawais/) and I really recommend it. :) 
