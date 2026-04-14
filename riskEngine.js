function calculateRisk(results) {
    const base = results.base.npv;
    const worst = results.worst.npv;

    const drop = (base - worst) / base;

    if (drop < 0.2) return "Low Risk";
    if (drop < 0.5) return "Moderate Risk";
    return "High Risk";
}

module.exports = { calculateRisk };