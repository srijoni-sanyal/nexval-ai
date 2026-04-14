function generateInsight(results) {
    const base = results.base.npv;
    const best = results.best.npv;
    const worst = results.worst.npv;

    let text = "";

    if (base > 0) {
        text += "The investment shows positive returns in the base case. ";
    } else {
        text += "The investment may not be viable in the base scenario. ";
    }

    if (best > base) {
        text += "There is strong upside potential. ";
    }

    if (worst < base * 0.7) {
        text += "However, downside risk is significant. ";
    }

    if (worst > 0) {
        text += "Overall, relatively safe.";
    } else {
        text += "Caution advised.";
    }

    return text;
}

module.exports = { generateInsight };