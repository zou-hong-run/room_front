export const setTitle = (title: string) => {
  title && (document.title = import.meta.env.VITE_APP_TITLE + '_' + title);
};
