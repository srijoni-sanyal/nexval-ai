function calculateIRR(cashFlows) {
    let guess = 0.1;

    for (let i = 0; i < 100; i++) {
        let npv = 0;
        let derivative = 0;

        for (let t = 0; t < cashFlows.length; t++) {
            const year = cashFlows[t].year;
            const value = cashFlows[t].profit;

            npv += value / Math.pow(1 + guess, year);
            derivative -= year * value / Math.pow(1 + guess, year + 1);
        }

        let newGuess = guess - npv / derivative;

        if (Math.abs(newGuess - guess) < 0.0001) {
            return newGuess;
        }

        guess = newGuess;
    }

    return guess;
}

module.exports = { calculateIRR };