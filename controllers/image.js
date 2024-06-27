const Clarifai = require("clarifai");
const app = new Clarifai.App({
  apiKey: "919f51430f744f08963bb175cd5a8942",
});

const handleAPICall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Unable to work with API"));
};

const updateEntries = (req, res, db) => {
  console.log(req.body);
  const { id, currentEntries } = req.body;

  db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      if (!entries.length) {
        return res.status(404).json("Unable to update entries");
      }
      res.json(entries);
    })
    .catch((err) => {
      return res.status(404).json("Unable to update entries");
    });
};
module.exports = {
  updateEntries: updateEntries,
  handleAPICall: handleAPICall,
};
