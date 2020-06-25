const checkPassword = (password) => /^(?=.+[A-Z])(?=.+[a-z])(?=.+[0-9])(?=.+[+\-_@$!%*?&#.,;:\[\]\{\}])[a-z0-9+\-_@$!%*?&#.,;:\[\]\{\}]{8,}$/i.test(password);

const checkEmail = (email) => /^([A-Za-z0-9\.\-])+\@([A-Za-z0-9\-])+\.([a-z]){2,}$/.test(email);

export {
  checkPassword,
  checkEmail,
};
