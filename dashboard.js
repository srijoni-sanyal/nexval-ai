let chart;

async function analyze() {
    try {
        // Collect input values
        const data = {
            initialRevenue: Number(document.getElementById("revenue").value),
            growthRate: Number(document.getElementById("growth").value),
            costs: Number(document.getElementById("costs").value),
            years: Number(document.getElementById("years").value),
            discountRate: Number(document.getElementById("discount").value),
            country: document.getElementById("country").value
        };

        // API Call
        const response = await fetch("http://localhost:3000/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // 🛑 Safety check
        if (!result.results || !result.results.base) {
            alert("Invalid server response");
            return;
        }

        // 🧠 Insight
        document.getElementById("output").textContent = result.insight;

        // 💰 KPIs
        document.getElementById("npv").textContent =
            result.results.base.npv.toFixed(2);

        document.getElementById("best").textContent =
            result.results.best.npv.toFixed(2);

        document.getElementById("worst").textContent =
            result.results.worst.npv.toFixed(2);

        // 📈 IRR
        if (result.irr !== undefined) {
            document.getElementById("irr").textContent =
                (result.irr * 100).toFixed(2) + "%";
        }

        // ⚠️ Risk + Color Styling
        if (result.risk) {
            const riskEl = document.getElementById("risk");
            riskEl.textContent = result.risk;

            riskEl.className =
                result.risk.includes("Low") ? "low" :
                result.risk.includes("Moderate") ? "moderate" :
                "high";
        }

        // 📊 Extract scenario data
        const base = result.results.base.cashFlows || [];
        const best = result.results.best.cashFlows || [];
        const worst = result.results.worst.cashFlows || [];

        const labels = base.map(x => "Year " + x.year);

        const baseData = base.map(x => x.profitAfterTax);
        const bestData = best.map(x => x.profitAfterTax);
        const worstData = worst.map(x => x.profitAfterTax);

        // 🛑 Canvas safety
        const canvas = document.getElementById("chart");

        if (!canvas) {
            alert("Chart container missing");
            return;
        }

        const ctx = canvas.getContext("2d");

        // Destroy old chart
        if (chart) chart.destroy();

        // 📈 Create premium chart
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Base Case",
                        data: baseData,
                        borderColor: "#22c55e",
                        tension: 0.4
                    },
                    {
                        label: "Best Case",
                        data: bestData,
                        borderColor: "#38bdf8",
                        tension: 0.4
                    },
                    {
                        label: "Worst Case",
                        data: worstData,
                        borderColor: "#ef4444",
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1200
                },
                plugins: {
                    legend: {
                        labels: {
                            color: "#e2e8f0"
                        }
                    },
                    tooltip: {
                        enabled: true
                    }
                },
                scales: {
                    x: {
                        ticks: { color: "#94a3b8" }
                    },
                    y: {
                        ticks: { color: "#94a3b8" }
                    }
                }
            }
        });

    } catch (error) {
        console.error("ERROR:", error);
        alert("Something went wrong. Check console.");
    }
}