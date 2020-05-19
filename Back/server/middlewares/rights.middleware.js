const AppError = require('../utils/app-error');
// const logger = require('../utils/logger');
const { userEventBus } = require('../api/admin/users');
const { methodToRight, rightToMethod } = require('../utils/method-to-right');

const checkUserRight = (reqPath, reqMethod, userRights) => {
  const rightId = methodToRight[reqMethod];
  const appRight = userRights.find(
    (userRight) => {
      // eslint-disable-next-line no-underscore-dangle
      const rightLevel = userRight.rights.find(right => right._id.toString() === rightId);
      // @todo modify this to check both parent and child && Include Scope
      return reqPath.indexOf(userRight.app.apiRoute) !== -1 && rightLevel;
    },
  );
  if (!appRight) {
    throw new AppError(503, 'ليس لديك صلاحية|You don\'t have this right', null, true);
  }
  return appRight;
};

const rightsMiddleware = appPath => async (req, res, next) => {
  const skippedRoutes = ['/login', '/apps/me'];
  if (skippedRoutes.indexOf(req.path) !== -1) {
    return next();
  }
  const user = await userEventBus.emit('getUserRights', { id: req.user.id, options: { populate: '1' } });
  try {
    req.user.userRights = user.userRights;
    const appRight = checkUserRight(appPath, req.method, user.userRights);
    const rightsObj = {};
    appRight.rights.forEach(
      (right) => {
        // eslint-disable-next-line no-underscore-dangle
        const rightMethod = rightToMethod[right._id.toString()];
        rightsObj[rightMethod] = true;
      },
    );
    req.appRights = rightsObj;
    return next();
  } catch (err) {
    throw err;
  }
};

module.exports = rightsMiddleware;
