/**
 * 检测是否完整的url路径
 * @param path
 * @returns
 */
export const isUrl = (path: string): boolean => {
  // return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
};
/**
 * const path = "https://example.com//path//to//resource";
const result = uniqueSlash(path);
console.log(result); // 输出： https://example.com/path/to/resource
 * 将路径中重复的正斜杆替换成单个斜杆隔开的字符串
 */
export const uniqueSlash = (path: string) =>
  path.replace(/(https?:\/)|(\/)+/g, '$1$2');
