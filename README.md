# What's this?

The `e7-webcli` project is the admin dashboard for organisers using entrello to
sell event tickets for theatre shows, concerts or similar.

The project is a `create-react-app`, which only renders views and handles events
to the backend https://entrello.io.


# Getting Started

### Prerequisites

- access to https://github.com/entrello/e7-webcli
- a postman instance with access to entrello workspace (invitation required)

## Installation of e7-webcli

### font awesome

In order to get a successful `npm install`, you first need to add our key to
your npm configuration. This is the *recommended way, @quaqua double-checked with the
font-awesome support team*.

```
npm config set "@fortawesome:registry" https://npm.fontawesome.com/
npm config set "//npm.fontawesome.com/:_authToken" A535C4DE-A67A-4941-BC59-86F74E48A2A2
```

### npm install

`npm install` should work now.

### run webcli

`npm start` should work now.

**a note on .env**

You'll find some config settings in the `.env` file on the root of this project.
Here you can also see, the backend used. By default, this is
`https://staging.entrello.io` and the websocket pendant.

**a note on tailwind-ui**

We also use components from tailwind-ui. There you can simply find templates to
copy code from. So, there is no key or such required. But If you stumble upon
any new component we require from tailwind-ui, please contact @quaqua.

