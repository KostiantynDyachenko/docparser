import { getQueryFormat, getQuery, queryCheck } from './utils';

export function initHomeTableData(search) {
    let queries = getQueryFormat(search);
    let groupfilter, userfilter;

    if (queryCheck(queries, "fgroup")) {
        groupfilter = getQuery(queries, "fgroup");
    }

    if (queryCheck(queries, "fuser")) {
        userfilter = getQuery(queries, "fuser");
    }

    return {
        groupfilter: groupfilter,
        userfilter: userfilter
    }
}
