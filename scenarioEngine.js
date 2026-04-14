function generateScenarios(input) {
    const base = {
        ...input
    };

    const best = {
        ...input,
        growthRate: input.growthRate + 0.1,   // BIG jump
        costs: input.costs * 0.8              // LOWER costs
    };

    const worst = {
        ...input,
        growthRate: input.growthRate - 0.1,   // BIG drop
        costs: input.costs * 1.3              // HIGHER costs
    };

    return {
        base,
        best,
        worst
    };
}

module.exports = { generateScenarios };
