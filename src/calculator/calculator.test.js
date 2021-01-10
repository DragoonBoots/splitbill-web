import {Bill, BillLine} from "./calculator";
import currency from "currency.js";

let bill = null;
beforeEach(() => {
    bill = new Bill();

    const lineUnsplitTaxed = new BillLine();
    lineUnsplitTaxed.name = "Unsplit, taxed";
    lineUnsplitTaxed.amount = currency(30.95);
    lineUnsplitTaxed.split = false;
    lineUnsplitTaxed.taxRate = 0.07;
    bill.lines.push(lineUnsplitTaxed);

    const lineUnsplitUntaxed = new BillLine();
    lineUnsplitUntaxed.name = "Unsplit, untaxed";
    lineUnsplitUntaxed.amount = currency(30.95);
    lineUnsplitUntaxed.split = false;
    lineUnsplitUntaxed.taxRate = 0;
    bill.lines.push(lineUnsplitUntaxed);

    const lineSplitTaxed = new BillLine();
    lineSplitTaxed.name = "Split, taxed";
    lineSplitTaxed.amount = currency(40.95);
    lineSplitTaxed.split = true;
    lineSplitTaxed.taxRate = 0.07;
    bill.lines.push(lineSplitTaxed);

    const lineSplitUntaxed = new BillLine();
    lineSplitUntaxed.name = "Split, untaxed";
    lineSplitUntaxed.amount = currency(40.95);
    lineSplitUntaxed.split = true;
    lineSplitUntaxed.taxRate = 0;
    bill.lines.push(lineSplitUntaxed);
});

afterEach(() => {
    bill = null;
});

test('Toted properly', () => {
    const totals = bill.calculate();

    expect(totals.generalTotal).toEqual(currency(64.07));
    expect(totals.usageTotal).toEqual(currency(84.77));
});
