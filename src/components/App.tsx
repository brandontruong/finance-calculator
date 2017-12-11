import * as React from 'react';
import { AppProps, AppState, AppConfig, TermItem } from "./AppProps";
import { FormErrors } from './FormErrors';

export class App extends React.Component<AppProps, AppState> {
	constructor(props) {
		super(props);
		// set initial state:
		this.state = {
			loanAmount: 0,
			selectedTermIndex: 0,
			deposit: 1000,
			monthlyRepayment: 0,
			formErrors: {loanAmount: '', selectedTermIndex: '', deposit: '' },
			loanAmountValid: true,
			selectedTermIndexValid: false,
			depositValid: true,
			formValid: false
		};
	}
	calculateFinance =  (e) => {
		this.validateForm();
		const { loanAmount, deposit, selectedTermIndex, formValid } = this.state;
		if (!formValid) return;
		const { interestRate, terms, paymentOption, financeFees, callback } = this.props.config;
		const selectedTerm: TermItem = terms[selectedTermIndex-1];
		const balloon_loan = window.financeCalculator(loanAmount, deposit, selectedTerm.term, parseFloat(selectedTerm.balloon),
			paymentOption, financeFees, interestRate);
		this.setState({monthlyRepayment: balloon_loan});
		callback(balloon_loan);
		return false;
	}
	termChanged = (e) => {
		const value = e.target.selectedIndex;
		this.setState({selectedTermIndex: value});
		// Save data to localStorage
		window.localStorage.setItem('selectedTermIndex', value);
	}
	handleUserInput = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({[name]: value});
		window.localStorage.setItem(name, value);
	}
	validateForm() {
		const {loanAmountValid, selectedTermIndexValid, depositValid, loanAmount, selectedTermIndex, deposit, formErrors } = this.state;
		let fieldValidationErrors: any = formErrors;
		let errorMessage: string = '';
		let isDepositValid = depositValid;
		let isLoanAmountValid = loanAmountValid;
		let isSelectedTermIndexValid = selectedTermIndexValid;

		// loan amount validation
		const strLoanAmount = loanAmount.toString();
		if (strLoanAmount.trim() === ''){
			errorMessage = 'Please enter your Loan Amount before continuing';
		}
		else if (isNaN(loanAmount) || parseFloat(strLoanAmount) <= 0) {
			errorMessage = 'Please enter a valid Loan Amount before continuing';
		}
		isLoanAmountValid = (errorMessage === '');
		fieldValidationErrors.loanAmount = errorMessage;

		// term validation
		isSelectedTermIndexValid = selectedTermIndex > 0;
		fieldValidationErrors.selectedTermIndex = isSelectedTermIndexValid ? '': 'Please enter your Loan Term before continuing.';

		// deposit amount validation
		const strDeposit = deposit.toString();
		if (strDeposit.trim() === ''){
			
		} else if (isNaN(deposit) || parseFloat(strDeposit) <= 0){
			errorMessage = 'Please enter a valid Deposit before continuing.';
		} 
		else if (parseFloat(strDeposit) >= loanAmount){
			errorMessage = 'Deposit must be less than the Loan Amount.';
		}
		isDepositValid = (errorMessage === '');
		fieldValidationErrors.deposit = errorMessage;
		this.setState({formErrors: fieldValidationErrors,
			loanAmountValid: isLoanAmountValid,
			depositValid: isDepositValid,
			selectedTermIndexValid: isSelectedTermIndexValid,
			formValid: isLoanAmountValid && isSelectedTermIndexValid && isDepositValid
		});
	}
	getInitialData() {
		const { fixedPrice } = this.props.config;
		this.setState({loanAmount: fixedPrice, monthlyRepayment: 0});
		// Get saved data from localStorage
		const localStorageSelectedTermIndex = window.localStorage.getItem('selectedTermIndex');
		const localStorageDeposit = window.localStorage.getItem('deposit');
		if ( localStorageSelectedTermIndex !== null && localStorageSelectedTermIndex !== '')
		{
			this.setState({selectedTermIndex: parseInt(localStorageSelectedTermIndex)});
		}
		if (localStorageDeposit!== null && localStorageDeposit !== '')
		{
			this.setState({deposit: parseInt(localStorageDeposit)});
		}
		this.setState({formErrors: {loanAmount: '', selectedTermIndex: '', deposit: '' }});
	}
	goToFinanceInquiry = (e) => {
		window.location.href = '/cars/services/finance/enquiry';
	}
	render() {
		const { interestRate, terms, paymentOption, callback, fixedPrice, reload } = this.props.config;
		const config = this.props.config;
		if (reload) {
			this.props.config.reload = false;
			this.getInitialData();
		}
		const state = this.state;
		const { loanAmount, deposit, selectedTermIndex, monthlyRepayment, formValid, formErrors, loanAmountValid, depositValid, selectedTermIndexValid } = this.state;
		return (
			<div className="modal fade show" id="finance-modal" role="dialog" 
				aria-labelledby="finance-modal">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="m-0 p-0"></h5>
							<button type="button" className="close" aria-label="Close" data-dismiss="modal">
								<span aria-hidden="true">×</span>
							</button>
						</div>
						<div className="modal-body">
							<p className="text-center">Calculate finance repayments based on Pickles Finance's <strong>interest rate offer of { config.interestRate }%</strong></p>
							<form>
								<div className="form-group">
									<label className="sr-only">Fixed Price Value</label>
									<div className={"input-group mb-2" + ((loanAmountValid) ? '' : ' has-error')}>
										<div className="input-group-addon"><i className="fa fa-tags"></i></div>
										<input className="form-control form-control-lg" type="text" value={this.state.loanAmount} onChange={this.handleUserInput.bind(this)} 
											placeholder="Loan amount" name="loanAmount" />
									</div>
									<div className={"input-group mb-2" + ((selectedTermIndexValid) ? '' : ' has-error')}>
										<div className="input-group-addon"><i className="fa fa-calendar-o"></i></div>
										<select className="custom-select form-control form-control-lg"
											value={ (selectedTermIndex === 0)? 0: terms[selectedTermIndex-1].id }
											onChange={this.termChanged.bind(this)} >
											<option key={'term' + '_option'} value="0">Term</option>
											{config.terms.map((term: TermItem) => (
												<option key={'filter' + term.id} value={term.id} data-term={term.term} 
													data-balloon={term.balloon}>
													{term.description}
												</option>
											))}
										</select>
									</div>
									<label className="sr-only">Deposit</label>
									<div className={"input-group mb-2" + ((depositValid) ? '' : ' has-error')}>
										<div className="input-group-addon"><i className="fa fa-dollar"></i></div>
										<input type="text" value={ deposit } className="form-control form-control-lg"
											onChange={ this.handleUserInput.bind(this) } name="deposit"
											placeholder="Deposit" />
									</div>
								</div>
							</form>
							<span className="mt-4">
								<div className="row">
									<div className="col-5 pr-1">
										<button type="button" className="btn mt-2 col-12 btn-primary btn-lg" 
											onClick={ this.calculateFinance.bind(this) }>
											Calculate
										</button>
									</div>
									<div className="col-7 pl-1">
										<button type="button" className="btn col-12 mt-2 btn-outline-primary btn-lg" 
											onClick={ this.goToFinanceInquiry.bind(this) }
											data-toggle="modal" data-dismiss="modal">Finance Inquiry</button>
									</div>
								</div>
								{ (monthlyRepayment > 0) && formValid &&
									<div className="alert mt-3 alert-info" role="alert">
										Monthly Repayment: {'$' + monthlyRepayment.toLocaleString()}
									</div>								
								}
								<FormErrors formErrors={formErrors} />
								<div className="mt-1 disclaimer-notice">
									<a className="btn btn-line p-0 mt-3 d-block" data-toggle="collapse" href="#finance-disclaimer" aria-expanded="false" aria-controls="collapseExample">View Disclaimer</a>
									<div className="collapse" id="finance-disclaimer">
										<p><small>Repayment estimates are provided for illustrative purposes only and are not offers of finance to you for any particular credit product or that any terms will be available to you. The repayment estimate determined is based on the accuracy of information provided by you and does not take into account your personal needs and financial circumstances. Any credit contract may be subject to additional fees and charges and may be subject to a lender’s credit approval criteria.</small></p>
									</div>
								</div>
							</span>
						</div>
      				</div>
				</div>
			</div>
		) 
    }
}