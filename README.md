# **just-backend-test**

## **A quick note**
I heard that this tech test had not been looked at yet, so I decided to spend a couple more hours on it trying to address a couple of the holes I was aware of. The additions I have made are
- Adding integration tests
- Setting up circleci 
- Adding test coverage checks so circleci will reject any builds based on this
- Moved the database file to within the project to make the review easier

If you would rather look at the test I originally sent in, as it was completed within the original time limit, then feel free to have a look at the branch 'previousMain'. From my point of view I just wanted to try out a couple things mostly around CI and circleci that I haven't had enough exposure to.
## **Introduction**

This service is designed to deal with [recording user trips](https://just-insure.slab.com/public/posts/just-backend-exercise-la2d85s9). It does this by attempting to follow a hexagonal architecture and DDD principles as much as possible. It uses sqlite to store all of the trips made.

At the end of each class, you will find a function that uses the singleton pattern which initializes the classes.

## **How to get it running**
### **install**
Run `npm i` to install all of the service dependencies

### **environment variables**
There is a .env.example file in the root of the project, this shows you the environment variables you need to run the application, and you can simply create a duplicate without the .example extension.

### **Setting up the DB**
In /databases, you will be able to find the sqlite database that you can use when running this application. 

### **Running the server**
Now that you are completely set up, you should be good to get it running. You can see the npm scripts in the package.json, but you can either run `npm start` or `npm watch`.

## **Testing**
All tests can be run using the command `npm test`. 

## **CircleCI**
This project is configured to be built, run all tests and collect tesing coverage through circleci. The environment variables are also set through circleci, these are identical to what you can find in the `.env.example` file.

## **Request**

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
## **Improvements**

### **error handling**
I am very aware this code does follow a happy path, I could definitely deal with errors from external services better.

### **External services being down**
I was looking at solving this issue. The way I was going to attempt to do this was to save the trip in the database regardless of whether these services were down. I was going to add another flag called `pushedUserNotification`. 

This will be given false if the services were down. How I would deal with this would then be to create a timer trigger function which would trigger at regular intervals, sweep up any entries that have yet to be sent to the user, calculate the cost and push the notification to the user.
### **Hexagonal architecture improvement**
Although I feel I have followed the key hexagonal architecture principles (domain comes first and is completely separated from any dependencies for example), I definitely could have done with researching into this a bit more. Before I got the tech test I had never heard of hexagonal architecture before, so hopefully my attempt at using it isn't too far off. 

### **Testing coverage**
If I had more time I would have increased the testing coverage, writing tests for the adapters. I thought with the limited time I would show how I test, which is why I have testing files for a database adapter and the trips domain, but I would test the other functionality if given more time

### **Transactions**
Usually done as a standard practice, I would wrap all updates/inserts statements in a transaction, even if there was only one. 


