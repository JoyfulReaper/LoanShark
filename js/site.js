function getInput() {
    document.getElementById("outputPane").classList.add("invisible");

    let principal = document.getElementById("principal").value;
    let term = document.getElementById("term").value;
    let rate = document.getElementById("rate").value;

    principal = parseInt(principal);
    term = parseInt(term);
    rate = parseInt(rate);

    if(!Number.isInteger(principal) || !Number.isInteger(term) || !Number.isInteger(rate)) {
        alert("Please enter valid integers for the principal, term, and rate.");
        return;
    }

    let loanObj = calculateLoanData(principal, term, rate);

    displayResults(loanObj);
}

function calculateLoanData(principal, term, rate) {

    let monthly = (principal * (rate / 1200) / (1 - (1 + rate/1200) ** -60)).toFixed(2);

    let loanObj = {
        Principal : principal,
        Term : term,
        Rate : rate,
        Monthly : monthly,
        TotalInterest: 0,
        Payments: []
    };

    let balance = principal;
    for(let i = 0; i < term; i++) {
        let interest = principal * rate / 1200;
        let payment = monthly - interest;

        loanObj.TotalInterest += interest;
        let interestPaid = loanObj.TotalInterest;

        balance -= payment;

        let current = {
            Interest : interest,
            Payment : payment,
            InterestPaid: interestPaid,
            Balance : balance
        }

        principal -= payment;

        loanObj.Payments.push(current);
    }

    return loanObj;
}

function displayResults(loanObj) {
    let tableBody = document.getElementById("results");
    let templateRow = document.getElementById("tableTemplate");

    tableBody.innerHTML = "";

    for(let i = 0; i < loanObj.Payments.length; i++) {
        let tableRow = document.importNode(templateRow.content, true);

        let rowCols = tableRow.querySelectorAll("td");
        rowCols[0] = 1;
        rowCols[1] = 2;
        rowCols[2] = 3;

        tableBody.appendChild(tableRow);
    }

    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });

    document.getElementById("payment").innerHTML = `${formatter.format(loanObj.Monthly)}`;
    document.getElementById("totalPrincipal").innerHTML = `${formatter.format(loanObj.Principal)}`;
    document.getElementById("interest").innerHTML = `${formatter.format((loanObj.TotalInterest).toFixed(2))}`;
    document.getElementById("total").innerHTML = `<strong>${formatter.format((loanObj.Principal + loanObj.TotalInterest).toFixed(2))}</strong>`;

    document.getElementById("outputPane").classList.remove("invisible");
}