export interface Contact<T> {
  name: string;
  thumbnail?: string;
  type: ContactType;
  info: T;
}

export enum ContactType {
  Individual = "Individual",
  Company = "Company",
}
