import * as chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import supertest from 'supertest';
import express from 'express';
import * as restaurantController from '../src/controllers/restaurantController.mjs'; // Adjust path if needed
import db from '../src/config/db.mjs';

const { expect } = chai;
chai.use(sinonChai);

const app = express();
app.use(express.json());
app.get('/api/restaurants/:id', restaurantController.getRestaurantById);
app.put('/api/restaurants/:id', restaurantController.updateRestaurant);

const request = supertest(app);

describe('Restaurant Controller', () => {
  let dbStub;

  beforeEach(() => {
    dbStub = sinon.stub(db, 'execute');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getRestaurantById', () => {
    it('should return a restaurant if found', async () => {
      dbStub.resolves([[{ id: 1, name: 'Test Restaurant', address: '123 Test St', google_place_id: 'test_place_id' }]]);

      const res = await request.get('/api/restaurants/1');

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        id: 1,
        name: 'Test Restaurant',
        address: '123 Test St',
        google_place_id: 'test_place_id'
      });
      expect(dbStub).to.have.been.calledOnceWithExactly('SELECT * FROM restaurants WHERE id = ?', ['1']); 
    });

    it('should return 404 if restaurant not found', async () => {
      dbStub.resolves([[]]);

      const res = await request.get('/api/restaurants/999');

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'Restaurant not found');
      expect(dbStub).to.have.been.calledOnceWithExactly('SELECT * FROM restaurants WHERE id = ?', ['999']);
    });

    it('should return 500 if there is a server error', async () => {
      dbStub.rejects(new Error('Database error'));

      const res = await request.get('/api/restaurants/1');

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('message', 'Server error');
    });
  });

  describe('updateRestaurant', () => {
    it('should update a restaurant if it exists', async () => {
      dbStub.onFirstCall().resolves([{ affectedRows: 1 }]);

      const res = await request.put('/api/restaurants/1').send({
        name: 'Updated Restaurant',
        address: '456 Updated St',
        google_place_id: 'updated_place_id'
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Restaurant updated successfully');
      expect(dbStub).to.have.been.calledOnceWithExactly(
        'UPDATE restaurants SET name = ?, address = ?, google_place_id = ?, updated_by = ? WHERE id = ?',
        ['Updated Restaurant', '456 Updated St', 'updated_place_id', undefined, '1'] 
      );
    });

    it('should return 404 if restaurant to update is not found', async () => {
      dbStub.onFirstCall().resolves([{ affectedRows: 0 }]);

      const res = await request.put('/api/restaurants/999').send({
        name: 'Non-existent Restaurant',
        address: 'Non-existent Address',
        google_place_id: 'non_existent_place_id'
      });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'Restaurant not found');
      expect(dbStub).to.have.been.calledOnceWithExactly(
        'UPDATE restaurants SET name = ?, address = ?, google_place_id = ?, updated_by = ? WHERE id = ?',
        ['Non-existent Restaurant', 'Non-existent Address', 'non_existent_place_id', undefined, '999'] 
      );
    });

    it('should return 500 if there is a server error', async () => {
      dbStub.rejects(new Error('Database error'));

      const res = await request.put('/api/restaurants/1').send({
        name: 'Updated Restaurant',
        address: '456 Updated St',
        google_place_id: 'updated_place_id'
      });

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('message', 'Server error');
    });
  });
});
