function normalizeCountry(input) {
    if (!input) return "";

    const c = input.toLowerCase().trim();

    // USA variations
    if (["usa", "us", "united states", "united states of america"].includes(c)) {
        return "usa";
    }

    // UK variations
    if (["uk", "united kingdom", "britain", "great britain"].includes(c)) {
        return "uk";
    }

    // India variations
    if (["india", "bharat"].includes(c)) {
        return "india";
    }

    // UAE
    if (["uae", "united arab emirates"].includes(c)) {
        return "uae";
    }

    return c;
}

function applyTax(cashFlows, country) {
    const c = normalizeCountry(country);

    let taxRate;

    switch (c) {
        case "india":
            taxRate = 0.25;
            break;
        case "usa":
            taxRate = 0.21;
            break;
        case "uk":
            taxRate = 0.19;
            break;
        case "uae":
            taxRate = 0.09;
            break;
        case "germany":
            taxRate = 0.30;
            break;
        case "singapore":
            taxRate = 0.17;
            break;
        default:
            taxRate = 0.20;
    }

    return cashFlows.map(cf => {
        const tax = cf.profit * taxRate;

        return {
            ...cf,
            tax,
            profitAfterTax: cf.profit - tax
        };
    });
}

module.exports = { applyTax };