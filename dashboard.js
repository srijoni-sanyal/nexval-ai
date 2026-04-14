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
            country: document.getElementById("country").value.toLowerCase()
        };

        if (!data.initialRevenue || !data.growthRate || !data.costs || !data.years || !data.discountRate) {
            alert("Please fill all fields properly");
            return;
        }

        document.getElementById("output").textContent = "Analyzing...";

        const response = await fetch("https://nexval-ai.onrender.com/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        document.getElementById("output").textContent = result.insight;

        const baseNPV = result.results.base.npv;

        document.getElementById("npv").textContent = "₹ " + baseNPV.toLocaleString();
        document.getElementById("best").textContent = "₹ " + result.results.best.npv.toLocaleString();
        document.getElementById("worst").textContent = "₹ " + result.results.worst.npv.toLocaleString();

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

        const decision = getDecision(baseNPV, result.irr, riskScore);
        const decisionEl = document.getElementById("decision");

        decisionEl.textContent = decision.text;
        decisionEl.className = decision.class;

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
                animation: false,
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

// 🔥 PDF DOWNLOAD
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
