import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";
const modalId: string = 'finance-calculator-modal';
const financeModal: string = '#finance-modal'; 
$(function () {
    $(document).on("finance-calculator-event", function (event, config) {
        if ($('#' + modalId).length === 0){
            $('body').append(`<div id='` + modalId + `'></div>`);
        }
        config.reload = true;
        ReactDOM.render(
            <App config={config} />,
            document.getElementById(modalId)
        , () => $(financeModal).modal('show'));
    });
});

window.financeCalculator = (loanAmount: number, deposit: number, term: number, balloon: number, paymentOption: string, financeFees: number, interestRate: number) => {
    const finance_fees = financeFees * 100;
    const loan_amount = (loanAmount - deposit) * 100 + finance_fees;
    const interestRatePercentage = (interestRate / 100) / 12;
    const balloonAmt = (balloon / 100) * loan_amount;
    const lhs = loan_amount - (balloonAmt / Math.pow((1 + interestRatePercentage),term));
    const rhs = interestRatePercentage / (1 - Math.pow(1 + interestRatePercentage, 0 - term));
    let balloon_loan = lhs * rhs;
    if(paymentOption == 'PERIOD_END') {
        balloon_loan = Math.round(balloon_loan) / 100;
    } else {
        balloon_loan = Math.round(balloon_loan / (interestRatePercentage + 1)) / 100;
    }
    return balloon_loan;
};

declare global {
    interface Window { financeCalculator: any; }
}
window.financeCalculator = window.financeCalculator || {};