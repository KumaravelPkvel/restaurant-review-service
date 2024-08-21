import db from '../config/db.mjs';

export const addReview = async (req, res) => {
  try {
    const { restaurant_id, rating, comment } = req.body;
    const userId = req.user.id;

    await db.execute(
      'INSERT INTO reviews (user_id, restaurant_id, rating, comment, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, restaurant_id, rating, comment, userId, userId]
    );

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { restaurant_id } = req.query;
    const [reviews] = await db.execute('SELECT * FROM reviews WHERE restaurant_id = ?', [restaurant_id]);

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this restaurant' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
