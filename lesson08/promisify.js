module.exports = function promisify(asyncFunction) {
  "use strict";
  return function () {
    "use strict";
    let args = [].slice.call(arguments, 0);
    return new Promise((resolve, reject) => {
      args.push((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
      asyncFunction.apply(undefined, args);
    });
  };
};
