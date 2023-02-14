import mediaQuery from 'css-mediaquery';

export default function createMatchMedia(width) {
    return query => ({
        matches: mediaQuery.match(query, { width }),
        /* istanbul ignore next */
        addListener: () => {},
        /* istanbul ignore next */
        removeListener: () => {},
    });
}
