const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const { calculateCashFlow } = require('./cashflowEngine');
const { calculateNPV } = require('./dcfEngine');
const { applyTax } = require('./taxEngine');
const { generateScenarios } = require('./scenarioEngine');
const { generateInsight } = require('./insightEngine');
const { calculateIRR } = require('./irrEngine');
const { calculateRisk } = require('./riskEngine');

app.get('/', (req, res) => {
    res.send('NexVal AI Running 🚀');
});

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

        const scenarios = generateScenarios({
            initialRevenue,
            growthRate,
            costs,
            years
        });

        const results = {};

        for (let key in scenarios) {
            const scenario = scenarios[key];

            const cashFlows = calculateCashFlow(scenario);
            const taxed = applyTax(cashFlows, country);

            const formatted = taxed.map(cf => ({
                year: cf.year,
                profit: cf.profitAfterTax
            }));

            const npv = calculateNPV(formatted, discountRate);

            results[key] = {
                cashFlows: taxed,
                npv
            };
        }

        const irr = calculateIRR(
            results.base.cashFlows.map(cf => ({
                year: cf.year,
                profit: cf.profitAfterTax
            }))
        );

        const riskData = calculateRisk(results);

        const insight = generateInsight(results, irr, riskData.level);

        res.json({
            results,
            insight,
            irr,
            risk: riskData.level,
            riskScore: riskData.score
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
