export const navigation = [
  {
    text: "Registration",
    path: "/notRegistered",
    icon: "home",
    auth: "X",
  },
  {
    text: "Home",
    path: "/home",
    icon: "home",
    auth: "N",
  },
  {
    text: "Home",
    path: "/home",
    icon: "home",
    auth: "Y",
  },
  {
    text: "User Information",
    path: "/profile",
    icon: "card",
    auth: "N",
  },

  {
    text: "Bank Accounts",
    path: "/bankAccountSummary",
    icon: "money",
    auth: "N",
  },
  {
    text: "Unallocated Bank Transactions",
    path: "/unallocatedBankTransactions",
    icon: "money",
    auth: "N",
  },
  {
    text: "Investments",
    path: "/investmentSummary",
    icon: "money",
    auth: "N",
  },
  {
    text: "Authorizations/Setup",
    icon: "folder",
    auth: "N",
    items: [
      {
        text: "Authorize Banks",
        path: "/authorizeUser",
        icon: "key",
      },

      {
        text: "Authorize Investments",
        path: "/authorizeInvestmentUser",
        icon: "imgarunlock",
      },
      {
        text: "Change Password",
        path: "/changePassword",
        icon: "check",
      },

      {
        text: "Validate Accounts",
        path: "/validateExistingAccounts",
        icon: "revert",
      },
    ],
  },
  {
    text: "Analysis Tools",
    icon: "folder",
    auth: "N",
    items: [
      {
        text: "Net Assets",
        path: "/netAssets",
        icon: "image",
      },
      {
        text: "Net Worth",
        path: "/netWorth",
        icon: "image",
      },
    ],
  },
  {
    text: "   Admin",
    icon: "image",
    auth: "Y",
    expanded: "N",
    items: [
      {
        text: "Company Profile",
        icon: "folder",
        auth: "Y",
        path: "/company",
      },
      {
        text: "Transaction Groups",
        icon: "folder",
        auth: "Y",
        path: "/transactionGroups",
      },
      {
        text: "Transaction Types",
        icon: "folder",
        auth: "Y",
        path: "/transactionTypes",
      },
      {
        text: "Code Mapping",
        icon: "folder",
        auth: "Y",
        path: "/codeMapping",
      },
      {
        text: "Asset Groups",
        icon: "folder",
        auth: "Y",
        path: "/assetTypeGroups",
      },
      {
        text: "Asset Types",
        icon: "folder",
        auth: "Y",
        path: "/assetTypes",
      },
      {
        text: "Banks",
        icon: "folder",
        auth: "Y",
        path: "/banks",
      },
      {
        text: "Investment Banks",
        icon: "folder",
        auth: "Y",
        path: "/investmentBanks",
      },
      {
        text: "Invest Groups",
        icon: "folder",
        auth: "Y",
        path: "/investmentGroups",
      },
      {
        text: "Invest Subgroups",
        icon: "folder",
        auth: "Y",
        path: "/investmentSubGroups",
      },
      {
        text: "Invest Trans Types",
        icon: "folder",
        auth: "Y",
        path: "/stockTransactionTypes",
      },
      {
        text: "New Clients",
        icon: "folder",
        auth: "Y",
        path: "/newClients",
      },
      {
        text: "List Clients",
        icon: "folder",
        auth: "Y",
        path: "/clientProfiles",
      },
    ],
  },

  {
    text: "Client",
    icon: "image",
    path: "/clientManagement",
    auth: "Y",
  },
  {
    text: "Imports",
    icon: "image",
    path: "/importExcelAssets",
    auth: "Y",
  },
  {
    text: "Reporting",
    icon: "image",
    auth: "Y",
    expanded: "N",
    items: [
      {
        text: "Progress",
        icon: "",
        path: "/clientProgress",
        auth: "Y",
      },
      {
        text: "Debt Summary",
        icon: "folder",
        path: "/clientDebtSummary",
        auth: "Y",
      },
      {
        text: "Net Worth",
        icon: "folder",
        path: "/clientNetWorth",
        auth: "Y",
      },
    ],
  },
];
