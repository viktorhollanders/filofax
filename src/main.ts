import "./global.css";
import initialData from "./data/prepopulation.json";
import {
  CompanyInfo,
  IndividualInfo,
  Contact,
  AppState,
  ContactType,
  KeyContact,
} from "./types";

const state: AppState = {
  app: null,
  contacts: [],
};

function parseContacts(contacts: any[]) {
  return contacts.map((c) => {
    const { name, type, ...rest } = c;
    const mappedType =
      c.type === "individual" ? ContactType.Individual : ContactType.Company;

    if (c.type === "individual") {
      return {
        name,
        thumbnail: "",
        type: mappedType,
        info: { ...rest },
      } as Contact<IndividualInfo>;
    } else {
      const { name, type, ...rest } = c;
      return {
        name,
        thumbnail: "",
        type: mappedType,
        info: { ...rest },
      } as Contact<CompanyInfo>;
    }
  });
}

function loadContacts() {
  state.contacts = JSON.parse(localStorage.getItem("contacts")!);
}

function loadInitialData() {
  if (!localStorage.getItem("contacts")) {
    const cleanedContacts = parseContacts([...initialData.contacts]);
    localStorage.setItem("contacts", JSON.stringify(cleanedContacts));
    loadContacts();
  } else {
    loadContacts();
  }
}

function renderHeader() {
  const title: string = "Address Book";
  const description: string =
    "You can see all stored contacts in the list below. Each contact is either an individual or a company account.";

  state.app!.innerHTML = `
    <div class="uk-container" id="header-container">
      <h1 class="uk-heading-small uk-text-bold">${title.toUpperCase()}</h1>
      <p class="uk-text-lead uk-text-default">${description} </p>
    </div>
    <div id="contacts-container"></div>
    `;
}

function generateInitials(name: string): string {
  const namesArray: Array<string> = name.split(" ");
  let initials = "";
  namesArray.forEach((n: string) => (initials += n[0]));
  return initials;
}

document.addEventListener("DOMContentLoaded", function () {
  state.app = document.querySelector("#app");

  function renderContactCards() {
    const contactsContainer = document.getElementById("contacts-container")!;
    const contactCards = state.contacts.map((contact, index) => {
      const initials = generateInitials(contact.name);
      let info = "";

      for (const [key, value] of Object.entries(contact.info)) {
        if (key === "keyContacts") {
          break;
        }
        info += `<p class="uk-margin-remove-bottom">${value}</p>`;
      }

      if (contact.type === ContactType.Company) {
        info += `<h3 class="uk-text-bold uk-margin-small-top uk-text-center">Key contacts</h3>`;
        (contact.info as CompanyInfo).keyContacts.map(
          (keyContact: KeyContact) => {
            info += `<div>
            <p class="uk-margin-remove-top uk-margin-small-bottom uk-text-center">${keyContact.name}</p>
            <p class="uk-margin-remove-top uk-margin-small-bottom uk-text-center">${keyContact.email}</p>
          </div>`;
          },
        );
      }

      return `
      <div class="uk-flex uk-flex-column uk-flex-middle uk-card uk-card-default uk-card-small card-padding-top contact-card">
          <div class="uk-flex uk-flex-center uk-flex-middle uk-width-small uk-height-small uk-border-circle uk-text-center green-background">
            <h1 class="uk-text-bold white-text">${initials}</h1>
          </div>
          <h3 class="uk-text-bold uk-text-center uk-margin-top">${contact.name}</h3>
          <p class="uk-margin-remove-top uk-margin-small-bottom">${contact.type === ContactType.Individual ? (contact.info as IndividualInfo).title : (contact.info as CompanyInfo).industry}</p>

          <div class="uk-flex uk-flex-column uk-flex-middle" id="contact-${index}" hidden>
            ${info}
          </div>


          <div class="uk-flex uk-flex-row uk-gap-small contact-card__icon-container">
            <a href="tel:${contact.info.phoneNumber}">
              <div class="contact-card__icon">
                <span uk-icon="icon: receiver"></span>
              </div>
            </a>
            <a href="mailto:${contact.info.emailAddress}">
              <div class="contact-card__icon">
                <span uk-icon="icon: mail"></span>
              </div>
             </a>
             <a href="#">
                <div class="contact-card__icon">
                  <span uk-icon="icon: commenting"></span>
                </div>
            </a>
            <a href="#">
              <div class="contact-card__icon">
                <span uk-icon="icon: calendar"></span>
              </div>
            </a>
          </div>

          <button class="uk-button uk-button-link uk-margin-small-top" uk-toggle="target: #contact-${index}, .toggled-chevron-${index}">
            <span class="contact-card__chevron toggled-chevron-${index}" uk-icon="icon: chevron-down"></span>
            <span class="contact-card__chevron toggled-chevron-${index}" uk-icon="icon: chevron-up" hidden></span>
          </button>
      </div>
      `;
    });

    contactsContainer.innerHTML = contactCards.join("");
  }

  loadInitialData();
  renderHeader();
  renderContactCards();
});
