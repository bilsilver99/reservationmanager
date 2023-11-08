export const navigation = [
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
    text: "Administration",
    icon: "folder",
    auth: "Y",
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
        text: "Investment Banks",
        icon: "folder",
        auth: "Y",
        path: "/investmentBanks",
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
    text: "Client Management",
    icon: "folder",
    auth: "Y",
    items: [
      {
        text: "Client",
        icon: "folder",
        path: "/clientManagement",
        auth: "Y",
      },
    ],
  },
];
