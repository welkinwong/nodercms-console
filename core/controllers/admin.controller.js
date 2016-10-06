/**
 * 管理首页
 * @param {Object} req
 * @param {Object} res
 */
module.exports = function (req, res) {
  res.sendFile('admin.html', { root: './public/assets/' });
};