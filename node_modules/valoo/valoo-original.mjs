export default (v, cb=[]) => c => {
  if (c===void 0) return v
  if (c.call) return cb.splice.bind(cb, cb.push(c)-1, 1, 0)
  v = c; for (c of cb) c && c(v)
}