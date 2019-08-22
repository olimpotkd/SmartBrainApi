const updateEntries = (req, res, db) => {
  console.log(req.body);
  const { id, currentEntries } = req.body;

  db('users').where({id})
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    if(!entries.length) {
      return res.status(404).json('Unable to update entries');
    }
    res.json(entries);
  })
  .catch(err => {
    return res.status(404).json('Unable to update entries');
  })    
}
module.exports = {
    updateEntries : updateEntries
}