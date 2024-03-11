const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "db", "contacts.json");

const updateContacts = async contacts =>
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts);
};

const getContactById = async contactId => {
  const contactsList = await listContacts();
  const result = contactsList.find(contact => contact.id === contactId);
  return result || null;
};

const addContact = async (name, email, phone) => {
  const { nanoid } = await import("nanoid");
  const contactsList = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contactsList.push(newContact);
  await updateContacts(contactsList);
  return newContact;
};

const removeContact = async contactId => {
  const contactsList = await listContacts();
  const index = contactsList.findIndex(contact => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const [result] = contactsList.splice(index, 1);
  await updateContacts(contactsList);
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
};
