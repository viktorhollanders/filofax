import { IndividualInfo } from "./IndividualInfo";

export interface KeyContact {
  name: string;
  email: string;
}

export interface CompanyInfo {
  phoneNumber: string;
  industry: string;
  emailAddress: string;
  address: string;
  website: string;
  keyContacts: KeyContact[];
}
