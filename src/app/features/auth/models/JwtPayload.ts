export interface JwtPayload {
  email: string;
  given_name: string;
  family_name: string;
  exp: number;
  role: string;
}
