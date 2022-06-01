# p6-piiquante
OpenClassrooms project6 - API for hotsauce webapp

# File structure of the API

# Controllers
Contains the files that processes the data(sauce.js) and action that can be done with it.
also contains the user controllers(user.js) processing user creation and connexion

# Images
contains the images sent through the client

# Middleware
Auth.js authenticate a user en verify his authorization then redirect to the apporpriate controller
Multer-config.js configures the image url and handles image types using mimetype

# Models
contains sauce and user models for MongoDB
helps identify the schema

# Routes
Sauce routes and user routes entry points. redirect to auth then to the right controllers

server.js serves our app.js that uses all the above files depending on what entry point is targeted.
app.js contains security with helmet and the MongoDB connexion
