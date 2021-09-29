const baseGoogleSearch = 'https://www.google.com/search?q='

module.exports = {
    createGoogleSearchUrl: async function (...args) {
        let combined = '';
        args.forEach((arg, index) => {
            combined = combined.concat(arg).concat(" ");
        })
        combined = combined.split(' ').join('+');
        return baseGoogleSearch.concat(combined)
    }
}
