/** What GoogleStrategy.validate() puts into `req.user`. */
export interface OAuthUser {
  email: string;
  name: string;
  picture?: string;
}
