module.exports = {
    verbose: false,
    qouteServerPort: 9000,
    marketServerPort: 9001,
    tradeServerPort: 3000,
    exchangeOpening: 32400,
    consoleDisplayTime: true,
    getTime: function () {
        return (this.consoleDisplayTime ? new Date().toUTCString() + " - " : "");
    }
};