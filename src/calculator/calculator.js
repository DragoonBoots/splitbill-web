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

    static _applyTax(lines) {
        for (const line of lines) {
            line.amount = line.amount.multiply(line.taxRate + 1);
        }
    }

    static _accumulate(lines) {
        let total = currency(0);
        for (const line of lines) {
            total = total.add(line.amount);
        }
        return total;
    }

    total() {
        if (this.lines.length === 0) {
            return new SplitBill(currency(0), currency(0));
        }

        const usageLines = this.lines.filter(line => line.split);
        const generalLines = this.lines.filter(line => !line.split);

        // Sanity check to ensure there's something to work with for the rest of the process.
        // These lines have amount and tax rate 0 so they won't affect calculations
        if (usageLines.length === 0) {
            const dummyUsage = new BillLine();
            dummyUsage.split = true;
            usageLines.push(dummyUsage);
        }
        if (generalLines.length === 0) {
            const dummyGeneral = new BillLine();
            dummyGeneral.split = false;
            generalLines.push(dummyGeneral);
        }

        // Apply tax
        Bill._applyTax(usageLines);
        Bill._applyTax(generalLines);

        // Tote the lines
        const usageTotal = Bill._accumulate(usageLines);
        const generalTotal = Bill._accumulate(generalLines);

        // Placeholder
        return new SplitBill(usageTotal, generalTotal);
    }
}
