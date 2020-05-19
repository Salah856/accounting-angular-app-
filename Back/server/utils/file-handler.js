const fs = require('fs');

class FileHandler {
  static readFile(path, options) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, options, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }

  static deleteFile(path) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(true);
      });
    });
  }

  static async writeFile(path, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }
}
module.exports = FileHandler;
