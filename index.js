import express from 'express';
import mongoose from 'mongoose';
import { Rating } from './models/Rating.js';
import { Professor } from './models/Professor.js';
import { Course } from './models/Course.js';

const app = express();
const port = 3000;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

// // connect to cluster db
mongoose.connect('mongodb+srv://ajplayer934:Lc1dXhhjcsMpw4lM@cluster0.npjrl.mongodb.net/rateMyProfessorDB')
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB Atlas error:', err));

// routes
app.get('/', async (req, res) => {
  try {
    let professors = await Professor.find();

    // filter by search query
    if (req.query.search) {
      professors = professors.filter(prof =>
        prof.name.toLowerCase().includes(req.query.search.toLowerCase())
      );
    }

    // add average rating for professors
    await Promise.all(professors.map(async (prof) => {
      const ratings = await Rating.find({ professor: prof._id });
      if (ratings.length > 0) {
        const total = ratings.reduce((sum, r) => sum + ((r.courseQuality + r.teachingQuality) / 2), 0);
        prof.overallExperience = total / ratings.length;
      }
    }));

    // sort professors
    if (req.query.sort === 'rating') {
      professors.sort((a, b) => req.query.order === 'asc'
        ? (a.overallExperience || 0) - (b.overallExperience || 0)
        : (b.overallExperience || 0) - (a.overallExperience || 0));
    } else {
      professors.sort((a, b) => req.query.order === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name));
    }

    res.render('index', {
      professors,
      searchQuery: req.query.search || '',
      sortBy: req.query.sort || 'name',
      sortOrder: req.query.order || 'asc'
    });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// get professor's ratings
app.get('/professor/:id', async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id);
    const ratings = await Rating.find({ professor: req.params.id }).populate('course');
    res.render('professor', { professor, ratings });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// page to rate professors
app.get('/professor/:id/rate', async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id).populate('courses');
    res.render('rate', { professor, courses: professor.courses });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// save the rating to the database
app.post('/professor/:id/rate', async (req, res) => {
  try {
    const { courseId, difficulty, teachingQuality, courseQuality } = req.body;

    // check if a rating exists
    let rating = await Rating.findOne({ professor: req.params.id, course: courseId });

    if (rating) {
      rating.difficulty = (rating.difficulty + Number(difficulty)) / 2;
      rating.teachingQuality = (rating.teachingQuality + Number(teachingQuality)) / 2;
      rating.courseQuality = (rating.courseQuality + Number(courseQuality)) / 2;
      await rating.save();
    } else {
      await Rating.create({
        course: courseId,
        professor: req.params.id,
        difficulty: Number(difficulty),
        teachingQuality: Number(teachingQuality),
        courseQuality: Number(courseQuality)
      });
    }

    res.redirect(`/professor/${req.params.id}`);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// start server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

