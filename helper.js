const cheerio = require('cheerio');

module.exports = {

    getEmailsFromBody: function (identifier, htmlBody) {
        stringHtmlBody = htmlBody.toString();
        emailArr = stringHtmlBody.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        let result=(emailArr===null) ? 'not found':emailArr;
        return { identifier, result};
    },
    findContactLink: function (html) {
        var $ = cheerio.load(html);
        let contactLink = Array.from($("a:contains('Contact')", html))
        return $(contactLink).attr('href');
        // for (const href of hrefArr) {
        //     let currentHref = $(href).attr('href');
        //     if (currentHref.concat('facebook.com'))
        //         return currentHref
        // }
        // return 'none'
    },
    isClosed(html) {
        var $ = cheerio.load(html);
        let isClosed = Array.from($("span:contains('Permanently closed')", html))
        if(isClosed.length > 0)
        {
            return 'permanently closed'
        }
        else{
            'no business site found'
        }
    },
    unescapeHTML: function (str) {
        var htmlEntities = {
            nbsp: ' ',
            cent: '¢',
            pound: '£',
            yen: '¥',
            euro: '€',
            copy: '©',
            reg: '®',
            lt: '<',
            gt: '>',
            quot: '"',
            amp: '&',
            apos: '\''
        };

        let final = str.replace(/\&([^;]+);/g, function (entity, entityCode) {
            var match;

            if (entityCode in htmlEntities) {
                return htmlEntities[entityCode];
                /*eslint no-cond-assign: 0*/
            } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
                return String.fromCharCode(parseInt(match[1], 16));
                /*eslint no-cond-assign: 0*/
            } else if (match = entityCode.match(/^#(\d+)$/)) {
                return String.fromCharCode(~~match[1]);
            } else {
                return entity;
            }
        });
        var find = '&';
        var re = new RegExp(find, 'g');
        final = final.replace(re, '');
        return final;;
    }
};