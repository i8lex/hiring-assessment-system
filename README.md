# Getting Started with Create React App and Node.js/Express

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Preparation

### In the client project directory: 
to install all dependency in terminal run:
### `npm install` 
Change URL to your server and port address (Example: Http://localhost:3001) in
### `src/constants/index.ts`

### In the server project directory:

In terminal, to install all dependency run: 
### `npm install` 

In the server root directory create file
## `.env` 
 and fill them like `.env.example` in example folder

## Available Scripts
In the client project directory, you can run:

### `npm react-scripts start`

In the server project directory, you can run:

### `npm react-scripts start`

## Technology stack `MERN` 
### Used libraries:
### Client:

`Redux/Toolkit/Persist` to fetching from/on server and save state.

`react-hook-form` - to form management

`tailwindcss/headlessui` - to components and styles

`clsx` - to styles management 

`wavesurfer` - to listening audio

`react-dnd` - to drag-n-drop elements (for change position order)

### Server: 

`multer` - to process requests multipart/form-data

`cors` - to CORS management

`jsonwebtoken` - to get/management authentication token

`bcrypt` - to encrypt/decrypt authentication token

`mongoose` - to connect/management in MongoDB

`dotenv` - to manage environment variables






