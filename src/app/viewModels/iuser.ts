export interface IUser {
  username?: string;
  branchID?: number;
  password?: string;
  token?: string;
  date?: string;
  email?: string;
  userID?: number;
  roles?: string[];
  refreshTokenExpiration?: string;
  isAuthenticated?: boolean;
  message?: string;
  userGroupID?: number;
}
