const { Thoughts } = require('../models');

module.exports = {
  // Get all Thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thoughts.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a Thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thoughts.findOne({ _id: req.params.thoughtsId }).select('-__v');

      if (!thought) {
        return res.status(404).json({ message: 'No Thought with that ID' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a Thought
  async createThought(req, res) {
    try {
      const thought = await Thoughts.create(req.body);
      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Update a Thought
  async updateThought(req, res) {
    try {
      const thought = await Thoughts.findByIdAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No Thought with this id.' });
      }

      res.json(thought);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json(err);
    }
  },

  // Delete a Thought
  async deleteThought(req, res) {
    try {
      const thought = await Thoughts.findOneAndDelete({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No Thought with this id.' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a Reaction for a Thought
  async createReaction(req, res) {
    try {
      const { thoughtId } = req.params;
      const { reactionText } = req.body;

      const thought = await Thoughts.findOneAndUpdate(
        { _id: thoughtId },
        { $push: { reactions: { text: reactionText } } },
        { new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No Thought with this id.' });
      }

      res.json(thought);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json(err);
    }
  },

  // Delete a Reaction from a Thought
  async deleteReaction(req, res) {
    try {
      const { thoughtId, reactionId } = req.params;

      const thought = await Thoughts.findOneAndUpdate(
        { _id: thoughtId },
        { $pull: { reactions: { _id: reactionId } } },
        { new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No Thought with this id.' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
