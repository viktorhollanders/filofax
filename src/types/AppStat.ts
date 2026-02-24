import { IndividualInfo } from "./IndividualInfo";
import { CompanyInfo } from "./CompanyInfo";
import { Contact } from "./Contact";

export interface AppState {
  app: HTMLElement | null;
  contacts: Contact<IndividualInfo | CompanyInfo>[];
}
