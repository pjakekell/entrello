export const convertHtml = (tags: Array<string>) => {
  if(!tags) return "";
  return `${tags.join('\n')}`;
}