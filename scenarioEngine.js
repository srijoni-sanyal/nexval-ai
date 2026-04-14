function generateScenarios(input) {
    const base = { ...input };

    const best = {
        ...input,
        growthRate: input.growthRate + 0.05,
        costs: input.costs * 0.9
    };

    const worst = {
        ...input,
        growthRate: input.growthRate - 0.05,
        costs: input.costs * 1.15
    };

    return { base, best, worst };
}

module.exports = { generateScenarios };
