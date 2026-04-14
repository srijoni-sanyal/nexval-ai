function calculateRisk(results) {
    const base = results.base.npv;
    const worst = results.worst.npv;

    const drop = (base - worst) / Math.abs(base);

    let score = Math.min(100, Math.max(0, drop * 100));

    let level;

    if (score < 30) level = "Low Risk";
    else if (score < 70) level = "Moderate Risk";
    else level = "High Risk";

    return {
        level,
        score: score.toFixed(0)
    };
}

module.exports = { calculateRisk };
