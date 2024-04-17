// contacts.js
import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import { Contact } from '../models/contactModel.js';

const contactsPath = path.resolve(process.cwd(), 'db', 'contacts.json');

export const getContactsList = ownerId => Contact.find({ owner: ownerId });

async function getContactById(contactId, owner) {
  try {
    const contact = await Contact.findOne({ _id: contactId, owner });

    if (!contact) {
      return null;
    } else {
      return contact;
    }
  } catch (error) {
    console.error('No contact found.', error);
  }
}

async function removeContact(contactId, owner) {
  try {
    const contact = await Contact.findOne({
      _id: contactId,
      owner,
    });

    if (!contact) {
      return null;
    }
    await Contact.findByIdAndDelete(contactId);
    return contact;
  } catch (error) {
    console.error(null);
  }
}

// add new contact
async function addContact(userId, { name, email, phone }) {
  try {
    const newContact = await Contact.create({
      name,
      email,
      phone,
      owner: userId,
    });

    return {
      ...newContact._doc,
      __v: undefined,
    };
  } catch (error) {
    console.error(error.message);
  }
}
//update contact

async function updateContact(id, contact_data) {
  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      return null;
    }
    const updated_contact = await Contact.findOneAndUpdate(
      { _id: id },
      contact_data,
      {
        new: true,
      }
    );
    return updated_contact;
  } catch (error) {
    console.error(error.message);
  }
}

export { getContactById, removeContact, addContact, updateContact };
