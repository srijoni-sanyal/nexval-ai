let chart;

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
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        document.getElementById("output").textContent = result.insight;

        document.getElementById("npv").textContent =
            result.results.base.npv.toFixed(2);

        document.getElementById("best").textContent =
            result.results.best.npv.toFixed(2);

        document.getElementById("worst").textContent =
            result.results.worst.npv.toFixed(2);

        if (result.irr !== undefined) {
            document.getElementById("irr").textContent =
                (result.irr * 100).toFixed(2) + "%";
        }

        // 🔥 Risk + Score
        if (result.risk && result.riskScore) {
            const riskEl = document.getElementById("risk");

            riskEl.textContent =
                result.risk + " (" + result.riskScore + "%)";

            riskEl.className =
                result.risk.includes("Low") ? "low" :
                result.risk.includes("Moderate") ? "moderate" :
                "high";
        }

        const base = result.results.base.cashFlows;
        const best = result.results.best.cashFlows;
        const worst = result.results.worst.cashFlows;

        const labels = base.map(x => "Year " + x.year);

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
                    {
                        label: "Base",
                        data: baseData,
                        borderColor: "#22c55e",
                        tension: 0.4
                    },
                    {
                        label: "Best",
                        data: bestData,
                        borderColor: "#38bdf8",
                        tension: 0.4
                    },
                    {
                        label: "Worst",
                        data: worstData,
                        borderColor: "#ef4444",
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

    } catch (error) {
        console.error(error);
        alert("Error occurred");
    }
}
