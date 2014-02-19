var ES_URL = 'http://search2.cogfor.com:9200';
var CDN_URL = 'https://dl.dropboxusercontent.com/u/176114/cdn/';


var client = new elasticsearch.Client({
    host: ES_URL,
    log: 'info'
});

var getSearchResults = function () {
    client.search({
        index: 'hhs',
        type: 'oai',
        size: 10,
        body: {
            query: {
                match: {
                    abstract: 'voeding'
                }
            }
        }
    }).then(function (resp) {
        var hits = resp.hits.hits;
        console.log(hits.length + ' docs fetched');
        drawSearchResults(hits);
    }, function (err) {
        console.trace(err.message);
    });
};


var drawSearchResults = function (hits) {
    var history = [{}];
    for (var index in hits) {
        var hit = hits[index]._source;
        var id = oai_id(hits[index]._id)
        var org_url = hit.url;
        var thumb_url = CDN_URL + id + "jpg";
        console.log(hit.date + ' : ' + id);
        // https://dl.dropboxusercontent.com/u/176114/cdn/10763.jpg  
        history.push({
            url: org_url,
            img: thumb_url
        });
    }

    //Get the HTML from the template   in the script tag
    var theTemplateScript = $("#img-carousel-template").html();

    //Compile the template
    var theTemplate = Handlebars.compile(theTemplateScript);
    $(".carousel").append(theTemplate(history));
};


var oai_id = function (id) {
    var _id = id.split(':');
    return _id[_id.length - 1];
};

function imgError(image) {
    image.onerror = "";
    image.src = "http://lorempixel.com/120/200/" + getRandomTopic();
    return true;
}

var topic = ["people", "technics", "fashion", "sports", "business", "abstract", "city", "transport", "food", "animals", "nightlife", "cats"];
function getRandomTopic() {
   return topic[Math.floor(Math.random() * topic.length)];
}


$(document).ready(function () {
    getSearchResults();
});

