const getProfileById = (req, res, db) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((users) => {
      if (users.length) {
        res.json(users[0]);
      } else {
        res.status(400).json("Not found");
      }
    });
};
module.exports = {
  getProfileById: getProfileById,
};
