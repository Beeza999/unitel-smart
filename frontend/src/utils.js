export const idOf = (item) => item?.id || item?._id;
export const lower = (v) => String(v || '').toLowerCase();
export const upper = (v) => String(v || '').toUpperCase();
export const isAdminRole = (role) => upper(role) === 'ADMIN';
export const isPopular = (pkg) => Boolean(pkg?.isPopular ?? pkg?.popular);
export const simDesc = (sim) => sim?.desc || sim?.description || '';
export const fmt = (n) => '₭' + Number(n || 0).toLocaleString();
export const displayPhone = (num = '') => {
  const s = String(num).replace(/\s/g, '');
  if (s.length === 11 && s.startsWith('020')) return `${s.slice(0, 3)} ${s.slice(3, 7)} ${s.slice(7)}`;
  return String(num);
};
