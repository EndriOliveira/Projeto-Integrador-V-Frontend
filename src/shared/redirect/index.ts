export const redirect = (path: string) => {
  setTimeout(() => {
    window.location.href = path;
  }, 1500);
};
