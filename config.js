module.exports = {
    verbose: false,
    exchangeIP: "192.168.2.10",
    qouteServerPort: 9000,
    marketServerPort: 9001,
    tradeServerPort: 3000,
    exchangeOpening: 32400,
    consoleDisplayTime: true,
    getTime: function () {
        return (this.consoleDisplayTime ? new Date().toUTCString() + " - " : "");
    }
};
