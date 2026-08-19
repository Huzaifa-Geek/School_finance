const form = document.getElementById("calculationForm");
const results = document.getElementById("results");
const expenseInputs = document.getElementById("expenseInputs");

let currentInput = null;


// -----------------------------
// Helpers
// -----------------------------

function money(value) {
    return "PKR " + Number(value).toLocaleString();
}


function formatName(name) {
    return name
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, char => char.toUpperCase());
}


// -----------------------------
// Calculate
// -----------------------------

async function calculate(data) {

    try {

        const response = await fetch("/api/calculate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });


        if (!response.ok) {

            const error = await response.text();

            console.error("API Error:", error);

            alert("Calculation failed.");

            return;
        }


        const result = await response.json();

        console.log("Calculation result:", result);

        displayResults(result);

        createExpenseInputs(result.expenses);

    } catch (error) {

        console.error("Calculation error:", error);

        alert("Could not calculate the budget.");

    }
}


// -----------------------------
// Main Form
// -----------------------------

form.addEventListener("submit", async function(event) {

    event.preventDefault();


    currentInput = {

        totalStudents:
            Number(
                document.getElementById("totalStudents").value
            ),

        feePerMonth:
            Number(
                document.getElementById("feePerMonth").value
            ),

        numTeachers:
            Number(
                document.getElementById("numTeachers").value
            ),

        rentInput:
            Number(
                document.getElementById("rentInput").value
            )

    };


    await calculate(currentInput);

});


// -----------------------------
// Display Results
// -----------------------------

function displayResults(result) {

    document.getElementById("grossRevenue").textContent =
        money(result.grossRevenue);


    document.getElementById("totalExpenses").textContent =
        money(result.totalExpenses);


    document.getElementById("remainingAmount").textContent =
        money(result.remainingAmount);


    const expensesContainer =
        document.getElementById("expenses");


    expensesContainer.innerHTML = "";


    for (
        const [name, value]
        of Object.entries(result.expenses)
    ) {

        const row =
            document.createElement("div");


        row.className = "expense-row";


        row.innerHTML = `
            <span>${formatName(name)}</span>
            <strong>${money(value)}</strong>
        `;


        expensesContainer.appendChild(row);

    }


    // -----------------------------
    // Calculation Explanation
    // -----------------------------

    const explanation =
        document.getElementById("calculationExplanation");


    explanation.innerHTML = `

        <p>
            <strong>Gross Revenue:</strong>
            ${currentInput.totalStudents}
            students ×
            PKR ${Number(
                currentInput.feePerMonth
            ).toLocaleString()}
            =
            ${money(result.grossRevenue)}
        </p>


        <p>
            <strong>Teacher Salaries:</strong>
            ${currentInput.numTeachers}
            teachers ×
            PKR 15,000 =
            ${money(result.expenses.teacherSalaries)}
        </p>


        <p>
            <strong>Admin & Staff:</strong>
            Fixed monthly allocation =
            ${money(result.expenses.adminStaff)}
        </p>


        <p>
            <strong>Electricity:</strong>
            ${currentInput.totalStudents}
            students ×
            PKR 300 =
            ${money(result.expenses.electricity)}
        </p>


        <p>
            <strong>Water:</strong>
            ${currentInput.totalStudents}
            students ×
            PKR 50 =
            ${money(result.expenses.water)}
        </p>


        <p>
            <strong>Stationery:</strong>
            ${currentInput.totalStudents}
            students ×
            PKR 150 =
            ${money(result.expenses.stationery)}
        </p>


        <p>
            <strong>Maintenance:</strong>
            ${currentInput.totalStudents}
            students ×
            PKR 100 =
            ${money(result.expenses.maintenance)}
        </p>


        <p>
            <strong>Rent:</strong>
            ${money(result.expenses.rent)}
        </p>


        <p>
            <strong>Contingency:</strong>
            5% of base expenses =
            ${money(result.contingency)}
        </p>


        <p>
            <strong>Total Expenses:</strong>
            ${money(result.totalExpenses)}
        </p>


        <p>
            <strong>Final Remaining Amount:</strong>
            ${money(result.grossRevenue)}
            −
            ${money(result.totalExpenses)}
            =
            <strong>
                ${money(result.remainingAmount)}
            </strong>
        </p>

    `;


    results.classList.remove("hidden");

}


// -----------------------------
// Editable Expenses
// -----------------------------

function createExpenseInputs(expenses) {

    expenseInputs.innerHTML = "";


    for (
        const [name, value]
        of Object.entries(expenses)
    ) {

        const wrapper =
            document.createElement("label");


        wrapper.className =
            "expense-input";


        wrapper.innerHTML = `

            <span>
                ${formatName(name)}
            </span>

            <input
                type="number"
                min="0"
                step="0.01"
                data-expense="${name}"
                value="${value}"
            >

        `;


        expenseInputs.appendChild(wrapper);

    }

}


// -----------------------------
// Recalculate
// -----------------------------

document
    .getElementById("recalculateButton")
    .addEventListener("click", async function() {

        if (!currentInput) {

            alert("Please calculate the budget first.");

            return;

        }


        const overrides = {};


        const inputs =
            expenseInputs.querySelectorAll("input");


        inputs.forEach(input => {

            overrides[input.dataset.expense] =
                Number(input.value);

        });


        await calculate({

            ...currentInput,

            overrides: overrides

        });

    });