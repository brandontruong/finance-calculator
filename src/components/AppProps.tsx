export interface AppState  {
	loanAmount: number;
	selectedTermIndex: number,
	deposit: number;
	monthlyRepayment: number;
	formErrors: {};
	loanAmountValid: boolean,
	selectedTermIndexValid: boolean,
	depositValid: boolean,
	formValid: boolean
};
export interface TermItem {
    id: number;
    term: number;
    balloon: string;
	description: string;
}
export interface AppConfig {
	reload: boolean;
	interestRate: number;
	fixedPrice: number;
	terms: TermItem[];
	paymentOption: string;
	financeFees: number;
	callback: any;
}

export interface AppProps { config: AppConfig }