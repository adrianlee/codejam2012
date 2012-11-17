module.exports = {
    process_payload: function (data) {
        var stock_array = data.split("|");
        console.log(stock_array);
    }
}