const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Engines
const { calculateCashFlow } = require('./cashflowEngine');
const { calculateNPV } = require('./dcfEngine');
const { applyTax } = require('./taxEngine');
const { generateScenarios } = require('./scenarioEngine');
const { generateInsight } = require('./insightEngine');
const { calculateIRR } = require('./irrEngine');
const { calculateRisk } = require('./riskEngine');

// Home route
app.get('/', (req, res) => {
    res.send('NexVal AI Running 🚀');
});

// MAIN ANALYSIS ROUTE
app.post('/analyze', (req, res) => {
    try {
        const {
            initialRevenue,
            growthRate,
            costs,
            years,
            discountRate,
            country
        } = req.body;

        // 🧱 Step 1: Scenario generation
        const scenarios = generateScenarios({
            initialRevenue,
            growthRate,
            costs,
            years
        });

        const results = {};

        // 🧱 Step 2: Loop through scenarios
        for (let key in scenarios) {
            const scenario = scenarios[key];

            // Cash flow
            const cashFlows = calculateCashFlow(scenario);

            // Tax
            const taxed = applyTax(cashFlows, country);

            // Format for DCF
            const formatted = taxed.map(cf => ({
                year: cf.year,
                profit: cf.profitAfterTax
            }));

            // NPV
            const npv = calculateNPV(formatted, discountRate);

            results[key] = {
                cashFlows: taxed,
                npv
            };
        }

        // 🧱 Step 3: IRR (base case)
        const irr = calculateIRR(
            results.base.cashFlows.map(cf => ({
                year: cf.year,
                profit: cf.profitAfterTax
            }))
        );

        // 🧱 Step 4: Risk
        const risk = calculateRisk(results);

        // 🧱 Step 5: Insight (UPDATED ENGINE)
        const insight = generateInsight(results, irr, risk);

        // 🧱 Step 6: Response
        res.json({
            results,
            insight,
            irr,
            risk
        });

    } catch (error) {
        console.error("SERVER ERROR:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

// PORT FIX (Render compatible)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
