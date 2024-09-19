export interface metadataJson {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attribute: { [key: string]: string }[];
}

export interface FormData {
  name: string;
  Symbol: string;
  decimal: number;
  supply: number;
  image: File | null;
  description: string;
  URL: string;
  addSocials: boolean;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  revokeUpdate: boolean;
  revokeFreeze: boolean;
  revokeMint: boolean;
}

export const defaultFormData: FormData = {
  name: "",
  Symbol: "",
  decimal: 9,
  supply: 100,
  image: null,
  description: "",
  URL: "",
  addSocials: false,
  revokeUpdate: false,
  revokeMint: false,
  revokeFreeze: false,
};
