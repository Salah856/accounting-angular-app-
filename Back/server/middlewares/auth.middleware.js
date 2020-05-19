const jwt = require('jsonwebtoken');
const AppError = require('../utils/app-error');

module.exports = () => (req, res, next) => {
  const skippedRoutes = ['/api/admin/users/login'];
  if (skippedRoutes.indexOf(req.path) !== -1) {
    next();
  } else {
    try {
      const token = req.headers.authorization;
      const verifyOptions = {
        expiresIn: parseInt(process.env.expiresIn, 10),
        issuer: process.env.issuer,
        subject: process.env.subject,
        algorithm: process.env.algorithm,
      };
      const legit = jwt.verify(token, process.env.publicKey, verifyOptions);
      const payload = { username: legit.username, id: legit.id };
      const signingOptions = {
        expiresIn: parseInt(process.env.expiresIn, 10),
        issuer: process.env.issuer,
        subject: process.env.subject,
        algorithm: process.env.algorithm,
      };
      const newToken = jwt.sign(
        payload,
        process.env.privateKey,
        signingOptions,
      );
      res.setHeader('Authorization', newToken);
      // Attach current user id and signature to the request
      req.user = { id: legit.id, username: legit.username };
      req.signature = `${legit.username}@${new Date().toISOString()}`;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError('401', 'انتهت فتره الدخول يرجى تسجيل الدخول مرة اخرى | Login session expired please login again', null, true);
      } else {
        throw new AppError('401', 'يرجى تسجيل الدخول اولا | You must be logged in first', null, true);
      }
    }
  }
};
