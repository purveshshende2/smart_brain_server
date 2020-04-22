

const handleRegister = (req,res,db,bcrypt) => {
    const {email,name,password} = req.body;
    if (!email || !name || !password){
      return res.status(400).json('incorrect form submission');
    }
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password,saltRounds);
    const salt = bcrypt.genSaltSync(saltRounds);
    db.transaction(trx => {
        trx.insert({
            hash : hash,
            email : email
        })
        .into ('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users1')
            .returning('*')
            .insert ({
                email : loginEmail[0],
                name : name,
                joined : new Date()
            })
            .then (user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    
    .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
    handleRegister : handleRegister
};
