import College from '@/public/College.json';

/**
 * 소속(ex. CSE: "정보컴퓨터공학부")를 소분류 대분류 구분없이 열거한 객체를 반환합니다.
 * @returns {object} {ENC:"공과대학", PHI:"철학과", ...}
 */
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

/**
 * 대분류 소속만(ex. 중앙동아리, 단과대학) 열거한 객체를 반환합니다.
 * @returns {object} {PNU:"중앙동아리", HUC:"인문대학", ...}
 */
export function mainCategory() {
  const result = {};
  Object.entries(College).forEach(([key, value]) => {
    result[key] = value.name;
  })
  return result;
}

/**
 * 대분류에 포함된 소분류 소속을 열거한 객체를 반환합니다.
 * @param {string} mainCategory IBC //정보의생명공학대학
 * @returns {object} {CSE:"정보컴퓨터공학부", BCE:"의생명융합공학부"}
 */
export function subcategories(mainCategory) {
  const result = {};
  Object.entries(College[mainCategory]).sort((a,b)=>{
    if (a[1] < b[1]) return -1;
    return 1;
  }).forEach(([k, value]) => {
    result[k] = value;
  });
  delete result.name;
  return result;
}

/**
 * 소분류를 포함한 대분류를 반환합니다.
 * 대분류가 들어올 시 대분류를 다시 반환합니다. 또한, 목록에 없는 소속은 null을 반환합니다.
 * @param {string} subCategory ME //기계공학부
 * @returns {string} ENC //공과대학
 */
export function findMainCategory(subCategory) {
  let result = null;
  Object.entries(College).forEach(([key, value]) => {
    if (subCategory === key) result = key;
    if (value[subCategory]!==undefined) result = key;
  });
  return result;
}