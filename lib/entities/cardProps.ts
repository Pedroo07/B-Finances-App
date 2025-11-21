export type CardProps = {
  primaryColor: string;
  secondaryColor: string;
  gradient: string[];
  logo: string;
  brand: string;
};
export type BanksDB = Record<string, CardProps>;