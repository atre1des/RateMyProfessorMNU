A database of ratings for professors, instructors, and teachers at Maqsut Narikbayev University.

To start the server:
1. Open the terminal
2. Type: "npm i express mongoose ejs"
3. Type: "npm init" and press enter
4. Type "nodemon index.js"

1. Open the terminal
2. Change directory: "cd C:\Program Files\MongoDB\Server\8.0\bin"
3. Type: "dir"
4. Press tab until you can select "mongosh.exe"
5. Type: "show databases"
6. Choose the local database: "use rateMyProfessorDB"

If you'd like to add more professors or courses:
1. Follow the previous steps without changing the MongoDB Atlas connection string
2. Type: "db.professors.insertOne({name: "FirstName LastName"})" "db.courses.insertOne({name: "Course Name})"

<!-- If you're using a local connection MongoDB database  -->
<!-- the code in index.js should be: -->
<!-- mongoose.connect('mongodb://127.0.0.1:27017/rateMyProfessorDB') -->