function generateScenarios(input) {
    return {
        base: { ...input },
        best: {
            ...input,
            growthRate: input.growthRate + 0.05,
            costs: input.costs * 0.9
        },
        worst: {
            ...input,
            growthRate: input.growthRate - 0.05,
            costs: input.costs * 1.1
        }
    };
}

module.exports = { generateScenarios };