import { Map } from 'immutable';

export function flattenObject(object) {
  const flatObject = Object.create(Object.prototype);
  const flatten = (combinedProp, value) => {
    if(Object(value) !== value) {
      return flatObject[combinedProp] = value;
    }
    for(let nextProp in value) {
      flatten(combinedProp ? combinedProp + '.' + nextProp : nextProp, value[nextProp]);
    }
  };
  flatten('', object);

  return flatObject;
}

export function flattenMap(map) {
  let flatMap = Map();
  const flatten = (combinedProp, value) => {
    if(!Map.isMap(value)) {
      return flatMap.setIn(combinedProp, value);
    }

    value.forEach((nextValue, nextProp) => {
      flatMap = flatten(combinedProp ? combinedProp + '.' + nextProp : nextProp, nextValue);
    });
    return flatMap;
  };
  return flatten('', map);
}
