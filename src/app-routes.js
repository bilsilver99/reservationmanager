import {
  HomePage,
  ProfilePage,
  AuthorizeUserPage,
  AuthorizeSpecificBankPage,
  AuthorizeInvestmentUserPage,
  AuthorizeAccountsPage,
  ValidateExistingAccountsPage,
  ChangePasswordPage,
  GraphsPage,
  NetAssetsPage,
  NetWorthPage,
  BankAccountSummaryPage,
  InvestmentSummaryPage,
  UnallocatedBankTransactions,
  CompanyPage,
  TransactionGroupsPage,
  TransactionTypesPage,
  CodeMappingPage,
  AssetTypeGroupsPage,
  AssetTypesPage,
  InvestmentBanksPage,
  ClientProfilesPage,
  ClientManagementPage,
  DebtSummaryPage,
  DashboardPage,
  BanksPage,
  InvestmentGroupsPage,
  InvestmentSubGroupsPage,
  StockTransactionTypesPage,
} from "./pages";

import { withNavigationWatcher } from "./contexts/navigation";
//import InvestmentGroups from "./pages/InvestmentGroups/investmentGroups";

const routes = [
  {
    path: "/authorizeUser",
    element: AuthorizeUserPage,
  },
  {
    path: "/unallocatedBankTransactions",
    element: UnallocatedBankTransactions,
  },
  {
    path: "/authorizeSpecificBank",
    element: AuthorizeSpecificBankPage,
  },
  {
    path: "/authorizeInvestmentUser",
    element: AuthorizeInvestmentUserPage,
  },
  {
    path: "/profile",
    element: ProfilePage,
  },
  {
    path: "/validateExistingAccounts",
    element: ValidateExistingAccountsPage,
  },
  {
    path: "/authorizeAccounts",
    element: AuthorizeAccountsPage,
  },
  {
    path: "/netAssets",
    element: NetAssetsPage,
  },
  {
    path: "/netWorth",
    element: NetWorthPage,
  },
  {
    path: "/graphs",
    element: GraphsPage,
  },
  {
    path: "/home",
    element: HomePage,
  },
  {
    path: "/changePassword",
    element: ChangePasswordPage,
  },
  {
    path: "/bankAccountSummary",
    element: BankAccountSummaryPage,
  },
  {
    path: "/investmentSummary",
    element: InvestmentSummaryPage,
  },
  {
    path: "/company",
    element: CompanyPage,
  },
  {
    path: "/transactionGroups",
    element: TransactionGroupsPage,
  },
  {
    path: "/transactionTypes",
    element: TransactionTypesPage,
  },
  {
    path: "/codeMapping",
    element: CodeMappingPage,
  },
  {
    path: "/assetTypeGroups",
    element: AssetTypeGroupsPage,
  },
  {
    path: "/assetTypes",
    element: AssetTypesPage,
  },
  {
    path: "/investmentBanks",
    element: InvestmentBanksPage,
  },
  {
    path: "/clientProfiles",
    element: ClientProfilesPage,
  },
  {
    path: "/clientManagement",
    element: ClientManagementPage,
  },
  {
    path: "/clientManagement/debtSummary",
    element: DebtSummaryPage,
  },
  {
    path: "/dashBoard",
    element: DashboardPage,
  },
  {
    path: "/banks",
    element: BanksPage,
  },
  {
    path: "/",
    element: HomePage,
  },
  {
    path: "/investmentGroups",
    element: InvestmentGroupsPage,
  },
  {
    path: "/investmentSubGroups",
    element: InvestmentSubGroupsPage,
  },
  {
    path: "/stockTransactionTypes",
    element: StockTransactionTypesPage,
  },
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});
