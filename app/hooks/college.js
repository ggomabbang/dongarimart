import College from '@/public/College.json';

export function raw() {
  const result = {}
  Object.entries(College).forEach(([key, value]) => {
    result[key] = value.name;
    Object.entries(value).forEach(([key2, value2]) => {
      result[key2] = value2;
    })
  })
  return result;
}