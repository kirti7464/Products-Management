<<<<<<< HEAD
const mongoose = require('mongoose')

const isValidString = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if(!value.match(/^[A-Za-z ]+$/)) return false;
    return true;
  };
  const isValidPincode = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value != "number") return false;
    if(!((/^[0-9]{6}$/).test(value))) return false;
    return true;
  };
  
  const isValidPass = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if ((value.length<=15)&&(value.length>=8)) 
    {
      return value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/)
    }
    return false
  };
  
  const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
  };
  const isValidEmail = function (email) {
    return email.match(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)
  };
  const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
  };
  const isValidIndianPhone = function (MobileNum) {
    if (!(MobileNum.length <= 12 && MobileNum.length >= 10)) {
      return false;
    }
    //first digit -6 to 9,rest 9 digit-0 to 9,12 digits-including 91,11 including 0
    return MobileNum.match(/(0|91)?[6-9][0-9]{9}/);
  };

=======
const mongoose = require('mongoose')

const isValidString = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if(!value.match(/^[A-Za-z ]+$/)) return false;
    return true;
  };
  const isValidPincode = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value != "number") return false;
    if(!((/^[0-9]{6}$/).test(value))) return false;
    return true;
  };
  
  const isValidPass = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if ((value.length<=15)&&(value.length>=8)) 
    {
      return value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/)
    }
    return false
  };
  
  const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
  };
  const isValidEmail = function (email) {
    return email.match(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)
  };
  const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
  };
  const isValidIndianPhone = function (MobileNum) {
    if (!(MobileNum.length <= 12 && MobileNum.length >= 10)) {
      return false;
    }
    //first digit -6 to 9,rest 9 digit-0 to 9,12 digits-including 91,11 including 0
    return MobileNum.match(/(0|91)?[6-9][0-9]{9}/);
  };

>>>>>>> dea9d840748959539eb6cfac383a623845044cd1
module.exports = {isValidString,isValidPincode, isValidRequestBody, isValidEmail,isValidPass,isValidObjectId,isValidIndianPhone}