const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const User = require('../models/User');
const { authMiddleware, checkAdmin } = require('../middleware/auth');

// Add Candidate (Admin Only)
router.post('/', authMiddleware, checkAdmin, async (req, res) => {
  try {
    const { name, party, age } = req.body;
    const candidate = new Candidate({ name, party, age });
    await candidate.save();
    res.status(201).json(candidate);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update Candidate (Admin Only)
router.put('/:id', authMiddleware, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, party, age } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(id, { name, party, age }, { new: true });

    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete Candidate (Admin Only)
router.delete('/:id', authMiddleware, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findByIdAndDelete(id);

    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Vote for a Candidate
router.post('/vote/:candidateId', authMiddleware, async (req, res) => {
  try {
    const { candidateId } = req.params;
    const userId = req.user._id;
    const user = req.user;

    // 1. Check if user is admin (Admins cannot vote)
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admins are not allowed to vote' });
    }

    // 2. Check if user has already voted
    if (user.isVoted) {
      return res.status(400).json({ message: 'You have already voted' });
    }

    // 3. Find candidate
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    // 4. Update Candidate
    candidate.votes.push(userId);
    candidate.voteCount += 1;
    await candidate.save();

    // 5. Update User
    user.isVoted = true;
    await user.save();

    res.json({ message: 'Vote recorded successfully', candidate });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get Vote Count (Sorted by votes)
router.get('/vote/count', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ voteCount: -1 });
    
    const result = candidates.map(c => ({
      party: c.party,
      name: c.name,
      voteCount: c.voteCount
    }));

    res.json({ voteRecords: result });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get All Candidates (Public)
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find().select('-votes'); // Exclude votes array for security
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
