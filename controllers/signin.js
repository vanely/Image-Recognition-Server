const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }

  db.select('email', 'hash').from('login').where('email', '=', email)
    .then(data => {

      //brcypt hashcode comparison
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {

        return db.select('*').from('users').where('email', '=', email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(errr => res.status(400).json(`Error unable to get user\n${err}`));
      } else {

        res.status(400).json(`Wrong Credentials`);
      }
    })
    .catch(err => res.status(400).json(`Wrong credentials\n${err}`));
}

module.exports = {
  handleSignin: handleSignin
};