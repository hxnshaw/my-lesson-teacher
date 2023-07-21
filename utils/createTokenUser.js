const createTokenUser = (user) => {
  return {
    first_name: user.first_name,
    middle_name: user.middle_name,
    last_name: user.last_name,
    phone_number: user.phone_number,
    // userId: user._id,
    email: user.email,
    //role: user.role,
  };
};

module.exports = createTokenUser;
