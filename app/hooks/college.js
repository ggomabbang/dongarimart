import College from '@/public/College.json';

export function raw() {
  const result = {};
  Object.entries(College).forEach(([key, value]) => {
    result[key] = value.name;
    Object.entries(value).forEach(([key2, value2]) => {
      result[key2] = value2;
    })
  })
  return result;
}

export function mainCategory() {
  const result = {};
  Object.entries(College).forEach(([key, value]) => {
    result[key] = value.name;
  })
  return result;
}

export function subcategories(key) {
  const result = {};
  Object.entries(College[key]).sort((a,b)=>{
    if (a[1] < b[1]) return -1;
    return 1;
  }).forEach(([k, value]) => {
    result[k] = value;
  });
  delete result.name;
  return result;
}

export function findMainCategory(name) {
  let result = null;
  Object.entries(College).forEach(([key, value]) => {
    if (name === key) result = key;
    console.log(value[name]!==undefined);
    if (value[name]!==undefined) result = key;
  });
  return result;
}