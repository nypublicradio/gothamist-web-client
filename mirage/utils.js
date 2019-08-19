export function paginate(collection, limit, offset = 0) {
  // coerce
  offset = Number(offset);
  limit = Number(limit);

  const START = offset;
  const END = (offset + 1 * limit);

  return collection.slice(START, END);
}

export function searchAllCollections(query, schema) {
  const collectionNames = schema.db._collections.mapBy('name').filter(n => n !== 'consts');

  for (let i = 0; i < collectionNames.length; i++) {
    let collection = collectionNames[i];
    let found = schema[collection].where({...query});
    if (found.models.length) {
      return found;
    }
  }
}
