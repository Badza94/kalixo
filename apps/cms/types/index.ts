export interface CountryProps {
  languages: TLanguage[];
  id: number;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  phoneCode: string;
  currencies: TCurrencyCountry[];
}

type TLanguage = {
  id: number;
  lngShort: string;
  lng: string;
  lngLong: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type TCurrencyCountry = {
  id: number;
  code: string;
  name: string;
  symbol: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export interface Currency {
  label: string;
  value: string;
  symbol: string;
  countryCode: string;
  currencyFullName: string;
}

export type Country = {
  id: number;
  name: string;
  value: string;
  label: string;
  countryCode: string;
};

export type LocaleOption = {
  value: string;
  label: string;
  icon?: string;
};
