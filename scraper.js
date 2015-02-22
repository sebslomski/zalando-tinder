var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');

var rootUrl = 'https://www.zalando.de';

var pageUrl = '/herrenbekleidung-strickpullover/';


var scrapePDP = function(link) {
    var r = request.get({
        url: link
    }, function(err, resp, body) {
        try {
            var $ = cheerio.load(body);

            var sleeve = $('.sleeve_length').text().trim();

            if (sleeve) {
                var match = sleeve.match(/(\d+\.?\d+)\scm\sbei\sGröße\s(\w)/);

                var length = Number(match[1]);
                var size = match[2];

                var requiredLength;

                if (size === 'M') {
                    requiredLength = 73;
                } else if (size === 'L') {
                    requiredLength = 74;
                }

                if (requiredLength && length >= requiredLength) {
                    var data = {
                        img: $('.slide img').attr('src'),
                        price: $('#articlePrice').text().trim().replace(',', '.').split(' ')[0],
                        name: $('.productName').text().trim(),
                        size: size,
                        length: length,
                        link: link,
                        sizes: {}
                    };

                    $('#listProductSizes li').each(function() {
                        var size = $(this).text().trim()[0];
                        if (size === 'M' || size === 'L'){
                            data['sizes'][size] = $(this).hasClass('available');
                        }
                    });

                    if (_(data['sizes']).values().any()) {
                        console.log(JSON.stringify(data) + ',');
                    }
                }
            }
        } catch (e) {}
    });
};


var scrapePage = function(page) {
    page = page || 1;

    var r = request.get({
        url: rootUrl + pageUrl + '?p=' + page
    }, function(err, resp, body) {
        var $ = cheerio.load(body);

        var links = [];

        $('a.productBox').each(function() {
            var link = $(this).attr('href');

            if (link.indexOf('https://') === -1) {
                link = rootUrl + link;
            }

            links.push(link);
        });


        links.map(scrapePDP);

        if ($('.pagination').eq(0).find('li:last-child').text() === '>') {
            return scrapePage(page + 1);
        }
    });
};


scrapePage();
