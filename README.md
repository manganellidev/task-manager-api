# Task Manager API

A REST API to register tasks for users. You will be able to CRUD users, CRUD tasks, upload user avatar, and perform login and logout.

# Running the app

## Prerequisites:

-   Node.js
-   MongoDB
-   SendGrid (optional)
-   Configure .env file

<br />

---

### Install Node.js

https://nodejs.org/en/download

<br />

---

### Start MongoDB using docker

In case you have mongodb locally you can skip this configuration.
Just make sure the mongodb is up and running on default port 27017.

#### Pull latest community mongodb version

`docker pull mongodb/mongodb-community-server`

#### Create mongodb container

`docker run --name mongodb -d -p 27017:27017 mongodb/mongodb-community-server:latest`

#### Create mongodb container with volume to persist your data locally

`docker run --name mongodb -d -p 27017:27017 -v ~/data/mongo:/data/db mongodb/mongodb-community-server:latest`

p.s: make sure the local folder has write permission

<br/>

---

### Configure .env file

#### Create file and set the environment variables

The file should be created in the root folder named **.env**

Populate the .env file with these four env vars:

```
PORT=3000
SENDGRID_API_KEY=your key
JWT_SECRET=any value
MONGODB_URL=mongodb://127.0.0.1:27017/task-manager-api
```

<br/>

---

### Setup SendGrid (optional)

1. Create a free account https://sendgrid.com/
2. Configure Sender Identity
3. Set API Key in .env file

<br/>

---

## Start Task Manager API

### Run the app

`npm start`

### Execute requests

1. Import postman collection from /docs directory
2. Execute requests as you wish :D
