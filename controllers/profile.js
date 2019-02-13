const handleProfile = (req, res, db) => {

  const { id } = req.params;

  //select entire users table by user id(knex SQL query)
  db.select('*').from('users').where({
      id: id
    })
    .then(user => {

      //if user's length !== 0 output the first column index matching the id.
      //if id matches user we  get all of users table row
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('User Not Foundd');
      }
    })
    .catch(err => res.status(400).json(`Error Getting User:\n${err}`));
}

module.exports = {
  handleProfile: handleProfile
};