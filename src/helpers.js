String.prototype.formatName = function () {
    return this.replaceAll(' ', '_')
        .replaceAll(':', '_')
        .replaceAll('-', '_')
        .replaceAll(',', '_')
        .replace('.', '_').toLowerCase();
};

String.prototype.replaceAll = function (search, replacement) {
    let target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
