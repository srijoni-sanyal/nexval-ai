function calculateNPV(cashFlows, discountRate) {
    let npv = 0;

    for (let i = 0; i < cashFlows.length; i++) {
        let year = cashFlows[i].year;
        let profit = cashFlows[i].profit;

        npv += profit / Math.pow(1 + discountRate, year);
    }

    return npv;
}

module.exports = { calculateNPV };