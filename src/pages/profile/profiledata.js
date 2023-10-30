const companyvalues = {
  CompanyNumber: 0,
  CompanyName: "Bill",
  AddressLineOne: "",
  AddressLineTwo: "",
  AddressLineThree: "",
  AddressLineFour: "",
  Country: "",
  PostalCode: "",
  FaxNumber: "",
  PhoneNumber: "",
  EmailAddress: "",
  UserName: "",
  UserPassword: "",
};

const positions = [
  "HR Manager",
  "IT Manager",
  "CEO",
  "Controller",
  "Sales Manager",
  "Support Manager",
  "Shipping Manager",
];

export default {
  getProfile() {
    return companyvalues;
  },
  getPositions() {
    return positions;
  },
};
