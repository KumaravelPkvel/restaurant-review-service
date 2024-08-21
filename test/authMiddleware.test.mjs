import { expect } from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import authMiddleware from '../src/middleware/authMiddleware.mjs'; 

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: sinon.stub().returns('Bearer testtoken')
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
    next = sinon.stub();
  });

  it('should call next if the token is valid', () => {
    sinon.stub(jwt, 'verify').returns({ id: 1, email: 'test@example.com' });

    authMiddleware(req, res, next);

    expect(req.user).to.deep.equal({ id: 1, email: 'test@example.com' });
    expect(next.calledOnce).to.be.true;

    jwt.verify.restore();
  });

  it('should return 401 if no token is provided', () => {
    req.header = sinon.stub().returns(null);

    authMiddleware(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: 'Access denied, no token provided' })).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should return 400 if the token is invalid', () => {
    sinon.stub(jwt, 'verify').throws();

    authMiddleware(req, res, next);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: 'Invalid token' })).to.be.true;
    expect(next.notCalled).to.be.true;

    jwt.verify.restore();
  });
});
