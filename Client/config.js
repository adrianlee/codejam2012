module.exports = {
    verbose: false,
    exchangeIP: 127.0.0.1,
    qouteServerPort: 9000,
    marketServerPort: 9001,
    tradeServerPort: 3000,
    guiServerPort: 8080,
    exchangeOpening: 32400,
    consoleDisplayTime: true,
    getTime: function () {
        return (this.consoleDisplayTime ? new Date().toUTCString() + " - " : "");
    }
};
