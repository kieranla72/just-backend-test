# **just-backend-test**
This service is designed to deal with [recording user trips](https://just-insure.slab.com/public/posts/just-backend-exercise-la2d85s9). It does this by attempting to follow a hexagonal architecture and DDD principles as much as possible. It uses sqlite to store all of the trips made.

At the end of each class, you will find a function that uses the singleton pattern which initializes the classes.

## **How to get it running**
### **install **
Run `npm i` to install all of the service dependencies

### **environment variables**
There is a .env.example file in the root of the project, this shows you the environment variables you need to run the application, and you can simply create a duplicate without the .example extension.

### **Setting up the DB**
If I had more time, I would have figured out how to build this programatically so it wouldn't be any effort on the user's side to set this up. However, it does need manually setting up which is thankfully quite straightforward. You will need to have sqlite installed (already comes with brew) and a gui like [DB Browser](https://sqlitebrowser.org/).

As there is only one table for saving trips, you will just need to run the following script 
```
CREATE TABLE "Trip" (
	"id"	INTEGER NOT NULL UNIQUE,
	"tripStart"	TEXT NOT NULL,
	"tripEnd"	TEXT NOT NULL,
	"duration"	TEXT NOT NULL,
	"distance"	REAL NOT NULL,
	"cost"	REAL NOT NULL,
	"userId"	INTEGER NOT NULL,
	PRIMARY KEY("id")
)
```
You will then need to replace the DB_LOCATION environment variables with wherever you have stored your DB.

### **Running the server**
Now that you are completely set up, you should be good to get it running. You can see the npm scripts in the package.json, but you can either run `npm start` or `npm watch`.

## **Testing**
All tests can be run using the command `npm test`.

## Request



## **Improvements**
### **Save a user trip** 
Endpoint: 
http://localhost:5000/trips

Body:
```
{
    "userId": 100,
    "tripStart": "2022-10-11T11:37:00.000Z",
    "tripEnd": "2022-10-11T12:53:00.000Z",
    "distance": 85.7
}
```
### **Get all user trips** 
Endpoint:
http://localhost:5000/users/:userId/trips

### **error handling**
I am very aware this code does follow a happy path, it doesn't answer the questions 
- *What happens if there's an error when connecting to the db?*
- *What if the external services are down (will cover the solution I would propose below)?*
- *What if the request input needs validation?*

These are all questions I would have thought about more if given more time.

### **External services being down**
I was looking at solving this issue. The way I was going to attempt to do this was to save the trip in the database regardless of whether these services were down. I was going to add another flag called `sentUserNotification`. 


This will be given false if the services were down. How I would deal with this would then be to create a timer trigger function which would trigger at regular intervals, sweep up any entries that have yet to be sent to the user, calculate the cost and push the notification to the user.
### **Hexagonal architecture improvement**
Although I feel I have followed the key hexagonal architecture principles (domain comes first and is completely separated from any dependencies for example), I definitely could have done with researching into this a bit more. Before I got the tech test I had never heard of hexagonal architecture before, so hopefully my attempt at using it isn't too far off. 

### **Testing coverage**
If I had more time I would have increased the testing coverage and thought about integration tests. I thought with the limited time I would show how I test, which is why I have testing files for a database adapter and the trips domain, but I would test the other functionality if given more time

### **Transactions**
Usually as a standard practice, I would wrap all updates/inserts statements in a transaction, even if there is only one. 


