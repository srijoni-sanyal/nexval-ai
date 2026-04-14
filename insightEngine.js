function generateInsight(results, irr, risk) {
    const baseNPV = results.base.npv;
    const bestNPV = results.best.npv;
    const worstNPV = results.worst.npv;

    const spread = bestNPV - worstNPV;

    let insight = "";

    if (baseNPV > 0) {
        insight += "The investment generates positive value in the base case. ";
    } else {
        insight += "The investment destroys value in the base case. ";
    }

    if (irr > 0.15) {
        insight += "Returns are strong. ";
    } else if (irr > 0.08) {
        insight += "Returns are moderate. ";
    } else {
        insight += "Returns are weak. ";
    }

    if (spread > baseNPV * 1.5) {
        insight += "There is high uncertainty across scenarios, indicating significant risk. ";
    } else if (spread > baseNPV * 0.7) {
        insight += "There is moderate variability, suggesting balanced risk. ";
    } else {
        insight += "Outcomes are stable, indicating lower risk. ";
    }

    if (baseNPV > 0 && irr > 0.12 && spread < baseNPV) {
        insight += "Overall, this appears to be an attractive and stable investment.";
    } else if (baseNPV > 0 && spread > baseNPV) {
        insight += "Overall, the investment is promising but carries meaningful downside risk.";
    } else {
        insight += "Overall, this investment may not meet return expectations.";
    }

    return insight;
}

module.exports = { generateInsight };
