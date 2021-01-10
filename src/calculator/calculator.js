import currency from "currency.js"

export class BillLine {
    constructor() {
        this.name = '';
        this.taxRate = 0.0;
        this.amount = currency(0);
        this.split = true;
    }
}

export class SplitBill {
    constructor(usageTotal, generalTotal) {
        this.usageTotal = usageTotal;
        this.generalTotal = generalTotal;
    }
}

export class Bill {
    constructor() {
        this.lines = [];
    }

    calculate() {
        if (this.lines.length === 0) {
            return new SplitBill(currency(0), currency(0));
        }

        // Placeholder
        return new SplitBill(currency(0), currency(0));
    }
}
