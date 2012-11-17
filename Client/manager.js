function Manager (name) {
    this.name = name;
    this.value = 0;
}

Manager.prototype = {
    checkAvailability: function () {
        var avaliableFlag = true;

        this.value++;

        return avaliableFlag;
    },
    initiateTrade: function (time, type, price, stradegy) {

    }
};

module.exports = Manager;