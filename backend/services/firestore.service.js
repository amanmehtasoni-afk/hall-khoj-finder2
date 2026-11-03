/**
 * Hall Khoj Finder — Unified Data Access Service Layer
 * Re-exports the clean, pure transactional data service.
 * Free of MongoDB and Firebase.
 */

const dataService = require('./data.service');

module.exports = {
  getCollection: dataService.getCollection,
  getDocument: dataService.getDocument,
  setDocument: dataService.setDocument,
  updateDocument: dataService.updateDocument,
  deleteDocument: dataService.deleteDocument,
  createDocument: dataService.createDocument,
  queryCollection: dataService.queryCollection
};
