let chart;

// ✅ Decision Logic (Improved)
function getDecision(npv, irr, riskScore) {
    if (npv > 0 && irr > 0.12 && riskScore < 40)
        return { text: "BUY", class: "buy" };

    if (npv > 0 && irr > 0.08 && riskScore < 70)
        return { text: "HOLD", class: "hold" };

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
            country: document.getElementById("country").value.toLowerCase()
        };

        // ✅ Input validation
        if (!data.initialRevenue || !data.growthRate || !data.costs || !data.years || !data.discountRate) {
            alert("Please fill all fields properly");
            return;
        }

        // ✅ Loading state
        document.getElementById("output").textContent = "Analyzing...";

        const response = await fetch("https://nexval-ai.onrender.com/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // ✅ Insight
        document.getElementById("output").textContent = result.insight;

        const baseNPV = result.results.base.npv;

        // ✅ Currency formatting
        document.getElementById("npv").textContent = "₹ " + baseNPV.toLocaleString();
        document.getElementById("best").textContent = "₹ " + result.results.best.npv.toLocaleString();
        document.getElementById("worst").textContent = "₹ " + result.results.worst.npv.toLocaleString();

        // ✅ IRR FIX (VERY IMPORTANT)
        if (result.irr !== undefined && isFinite(result.irr)) {
            document.getElementById("irr").textContent =
                (result.irr * 100).toFixed(2) + "%";
        } else {
            document.getElementById("irr").textContent = "N/A";
        }

        // ✅ Risk + Score
        let riskScore = Number(result.riskScore);

        if (result.risk) {
            const riskEl = document.getElementById("risk");

            riskEl.textContent = result.risk + " (" + riskScore + "%)";

            riskEl.className =
                result.risk.includes("Low") ? "low" :
                result.risk.includes("Moderate") ? "moderate" :
                "high";
        }

        // ✅ Decision Engine
        const decision = getDecision(baseNPV, result.irr, riskScore);
        const decisionEl = document.getElementById("decision");

        decisionEl.textContent = decision.text;
        decisionEl.className = decision.class;

        // ✅ Chart Data
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
                    {
                        label: "Base",
                        data: baseData,
                        borderColor: "#22c55e",
                        backgroundColor: "rgba(34,197,94,0.1)",
                        fill: true,
                        tension: 0.2
                    },
                    {
                        label: "Best",
                        data: bestData,
                        borderColor: "#38bdf8",
                        backgroundColor: "rgba(56,189,248,0.1)",
                        fill: true,
                        tension: 0.2
                    },
                    {
                        label: "Worst",
                        data: worstData,
                        borderColor: "#ef4444",
                        backgroundColor: "rgba(239,68,68,0.1)",
                        fill: true,
                        tension: 0.2
                    }
                ]
            },
            options: {
                animation: false,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            maxTicksLimit: 8
                        }
                    },
                    y: {
                        ticks: {
                            callback: function(value) {
                                return "₹ " + value;
                            }
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

// ✅ PDF DOWNLOAD
function downloadPDF() {
    const element = document.getElementById("report");

    const opt = {
        margin: 0.5,
        filename: "NexVal_Report.pdf",
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}
