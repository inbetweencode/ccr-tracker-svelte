export const hasOverlap = (arr, filter) => {
  return filter
    .filter((d) => d.selected)
    .map((d) => d.id)
    .some((item) => arr.includes(item));
};
