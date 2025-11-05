const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Movie = require('../models/Movie');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/movies
// @desc    Get all movies for logged-in user (with pagination)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const movies = await Movie.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Movie.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ message: 'Error fetching movies' });
  }
});

// @route   GET /api/movies/:id
// @desc    Get single movie
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const movie = await Movie.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ message: 'Error fetching movie' });
  }
});

// @route   POST /api/movies
// @desc    Create new movie
// @access  Private
router.post('/', protect, upload.single('poster'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('publishingYear').isInt({ min: 1888 }).withMessage('Valid year is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, publishingYear } = req.body;
    const poster = req.file ? req.file.filename : null;

    const movie = await Movie.create({
      title,
      publishingYear,
      poster,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({ message: 'Error creating movie' });
  }
});

// @route   PUT /api/movies/:id
// @desc    Update movie
// @access  Private
router.put('/:id', protect, upload.single('poster'), [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('publishingYear').optional().isInt({ min: 1888 }).withMessage('Valid year is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let movie = await Movie.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Update fields
    if (req.body.title) movie.title = req.body.title;
    if (req.body.publishingYear) movie.publishingYear = req.body.publishingYear;
    if (req.file) movie.poster = req.file.filename;

    await movie.save();

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({ message: 'Error updating movie' });
  }
});

// @route   DELETE /api/movies/:id
// @desc    Delete movie
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const movie = await Movie.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    await movie.deleteOne();

    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({ message: 'Error deleting movie' });
  }
});

module.exports = router;