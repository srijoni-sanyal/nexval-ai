let chart;

function getDecision(npv, irr, riskScore) {
    if (npv > 0 && irr > 0.12 && riskScore < 40) return { text: "BUY", class: "buy" };
    if (npv > 0 && riskScore < 70) return { text: "HOLD", class: "hold" };
    return { text: "AVOID", class: "avoid" };
}

async function analyze() {
    try {
        const data = {
            initialRevenue: Number(document.getElementById("revenue").value),
            growthRate: Number(document.getElementById("growth").value),
            costs: Number(document.getElementById("costs").value),
            years: Number(document.getElementById("years").value),
            discountRate: Number(document.getElementById("discount").value),
            country: document.getElementById("country").value
        };

        const response = await fetch("https://nexval-ai.onrender.com/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        document.getElementById("output").textContent = result.insight;

        const baseNPV = result.results.base.npv;

        document.getElementById("npv").textContent = baseNPV.toFixed(2);
        document.getElementById("best").textContent = result.results.best.npv.toFixed(2);
        document.getElementById("worst").textContent = result.results.worst.npv.toFixed(2);

        if (result.irr !== undefined) {
            document.getElementById("irr").textContent =
                (result.irr * 100).toFixed(2) + "%";
        }

        let riskScore = Number(result.riskScore);

        if (result.risk) {
            const riskEl = document.getElementById("risk");

            riskEl.textContent = result.risk + " (" + riskScore + "%)";

            riskEl.className =
                result.risk.includes("Low") ? "low" :
                result.risk.includes("Moderate") ? "moderate" :
                "high";
        }

        // 🔥 BUY / HOLD / AVOID
        const decision = getDecision(baseNPV, result.irr, riskScore);
        const decisionEl = document.getElementById("decision");

        decisionEl.textContent = decision.text;
        decisionEl.className = decision.class;

        // Chart data
        const base = result.results.base.cashFlows;
        const best = result.results.best.cashFlows;
        const worst = result.results.worst.cashFlows;

        const labels = base.map(x => "Y" + x.year);

        const baseData = base.map(x => x.profitAfterTax);
        const bestData = best.map(x => x.profitAfterTax);
        const worstData = worst.map(x => x.profitAfterTax);

        const ctx = document.getElementById("chart").getContext("2d");

        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [
                    { label: "Base", data: baseData, borderColor: "#22c55e", tension: 0.2 },
                    { label: "Best", data: bestData, borderColor: "#38bdf8", tension: 0.2 },
                    { label: "Worst", data: worstData, borderColor: "#ef4444", tension: 0.2 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            maxTicksLimit: 8
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error(error);
        alert("Error occurred");
    }
}
