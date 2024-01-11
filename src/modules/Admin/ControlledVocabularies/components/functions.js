export function pushHistory(history, pageSize, currentPage, sortBy, sortDirection) {
    history.push({
        // pathname: '/communities', // '/vocabularies',
        pathname: '/admin/controlled-vocabularies',
        search: `?pageSize=${pageSize}&page=${currentPage}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
    });
    return { currentPage, pageSize, sortBy, sortDirection };
}
