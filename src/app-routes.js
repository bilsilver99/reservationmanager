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
} from "./pages";
import { withNavigationWatcher } from "./contexts/navigation";

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
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});
