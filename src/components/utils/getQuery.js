export function getQuery(qs, param) {
    return qs.find(q => q.param === param);
}
