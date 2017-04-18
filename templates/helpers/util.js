module.exports = {
    cleanID: function (id) {
        if (id.length) {
            return cleanArray(id);
        }
        return id;
    }
}

function cleanArray(actual) {
    var newArray = new Array();
    for (var i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}
