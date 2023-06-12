export function queryCheck(qs, param) {
    return qs.some(q => q.param === param);
}
