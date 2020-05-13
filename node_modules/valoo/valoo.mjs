export default function valoo(v) {
  const cb = [];
  function value(c) {
    if (arguments.length) cb.map(f => { f && f(v=c); });
    return v;
  }
  value.on = c => {
    const i = cb.push(c)-1;
    return () => { cb[i] = 0; };
  };
  return value;
}