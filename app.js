const express = require('express');
const mongoose = require('mongoose');
const Student = require('./student.js');
const ObjectId = require("mongoose").Types.ObjectId;
const ejs = require('ejs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('views', './views');
app.set('view engine', "ejs");



const url = `mongodb+srv://toddnash:Summer2023@cluster0.ypw5ypl.mongodb.net/students`;

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    });


app.get('/attendance', async (req, res) => {

const students = await Student.find({});
const maxAttendanceCount = Math.max(...students.map(s => s.attendanceCount));

res.render('attendance.ejs', { students, maxAttendanceCount });



});


app.post('/reset', async (req, res) => {
  try {
    const students = await Student.find({});
    for (let i = 0; i < students.length; i++) {
      students[i].attendanceCount = 0;
      await students[i].save();
    }
    res.redirect('/attendance');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while resetting student records.');
  }
});


app.post('/addstudent', (req, res) =>{

    const student = new Student({
        name: req.body.name,
        email: req.body.email,
       });
    
       student.save();

       res.redirect('/attendance');
});


app.post('/updatestudent', async (req, res) => {
  // set a threshold value for attendance count
  
  try {
    for (let i = 0; i < req.body.attendance.length; i++) {
      const studentId = req.body.attendance[i];
      const result = await Student.findByIdAndUpdate(
        studentId,
        { $inc: { attendanceCount: 1 } },
        { new: true }
      );
    }

  res.redirect('/attendance');
    
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while updating student records.');
  }
});



  

app.post('/removestudent', async (req, res) => {
    const studentName = req.body.name;
    
    try {
      const result = await Student.deleteOne({ name: studentName });
  
      if (result.deletedCount === 0) {
        res.status(404).send('Student not found.');
      } else {
        res.send(`Successfully deleted ${result.deletedCount} student.`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while deleting the student.');
    }
  });
  


// optional list collections    
 //console.log(await mongoose.cStudentonnection.db.listCollections().toArray());


app.listen(3000, () => {console.log('Successfully connected to port 3000.')});