
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
