<<<<<<< HEAD
const bcrypt = require("bcrypt");

const hassPassWord=async(password)=>{
    try {
        const saltRounds = 10;
      const hasspassword = await bcrypt.hash(password, saltRounds);
      return hasspassword;
        
    } catch (error) {
       res.status(500).send({status:false,message:"hashpassword error"})
    }
}

// /=======================================================
const comparePassword = async (password, hashpassword) => {
  return bcrypt.compare(password, hashpassword);
};

=======
const bcrypt = require("bcrypt");

const hassPassWord=async(password)=>{
    try {
        const saltRounds = 10;
      const hasspassword = await bcrypt.hash(password, saltRounds);
      return hasspassword;
        
    } catch (error) {
       res.status(500).send({status:false,message:"hashpassword error"})
    }
}

// /=======================================================
const comparePassword = async (password, hashpassword) => {
  return bcrypt.compare(password, hashpassword);
};

>>>>>>> dea9d840748959539eb6cfac383a623845044cd1
module.exports = { hassPassWord, comparePassword };