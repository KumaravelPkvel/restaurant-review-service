import db from '../config/db.mjs';

export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const [restaurant] = await db.execute('SELECT * FROM restaurants WHERE id = ?', [id]);

    if (restaurant.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, google_place_id } = req.body;
    const userId = req.user ? req.user.id : undefined; // Make sure userId is handled correctly

    const [result] = await db.execute(
      'UPDATE restaurants SET name = ?, address = ?, google_place_id = ?, updated_by = ? WHERE id = ?',
      [name, address, google_place_id, userId, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({ message: 'Restaurant updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};