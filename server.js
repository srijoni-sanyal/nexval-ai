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

// MAIN ANALYZE ROUTE
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

        // 1. Generate scenarios
        const scenarios = generateScenarios({
            initialRevenue,
            growthRate,
            costs,
            years
        });

        const results = {};

        // 2. Loop through scenarios
        for (let key in scenarios) {
            const scenario = scenarios[key];

            // Cash flow
            const cashFlows = calculateCashFlow(scenario);

            // Apply tax
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

        // 3. Insight
        const insight = generateInsight(results);

        // 4. IRR (base case)
        const irr = calculateIRR(
            results.base.cashFlows.map(cf => ({
                year: cf.year,
                profit: cf.profitAfterTax
            }))
        );

        // 5. Risk
        const risk = calculateRisk(results);

        // 6. Final response
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

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});