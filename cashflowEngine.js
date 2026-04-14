function calculateCashFlow({ initialRevenue, growthRate, costs, years }) {
    let cashFlows = [];
    let revenue = initialRevenue;

    for (let i = 1; i <= years; i++) {
        revenue = revenue * (1 + growthRate);
        let profit = revenue - costs;

        cashFlows.push({
            year: i,
            revenue,
            profit
        });
    }

    return cashFlows;
}

module.exports = { calculateCashFlow };