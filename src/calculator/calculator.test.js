import {Bill, BillLine, PersonPeriod} from "./calculator";
import {DateTime, Interval} from "luxon";
import Big from "big.js";

let bill = null;
beforeEach(() => {
    bill = new Bill();

    const lineUnsplitTaxed = new BillLine();
    lineUnsplitTaxed.name = "Unsplit, taxed";
    lineUnsplitTaxed.amount = new Big(30.95);
    lineUnsplitTaxed.split = false;
    lineUnsplitTaxed.taxRate = 0.07;
    bill.lines.push(lineUnsplitTaxed);

    const lineUnsplitUntaxed = new BillLine();
    lineUnsplitUntaxed.name = "Unsplit, untaxed";
    lineUnsplitUntaxed.amount = new Big(30.95);
    lineUnsplitUntaxed.split = false;
    lineUnsplitUntaxed.taxRate = 0;
    bill.lines.push(lineUnsplitUntaxed);

    const lineSplitTaxed = new BillLine();
    lineSplitTaxed.name = "Split, taxed";
    lineSplitTaxed.amount = new Big(40.95);
    lineSplitTaxed.split = true;
    lineSplitTaxed.taxRate = 0.07;
    bill.lines.push(lineSplitTaxed);

    const lineSplitUntaxed = new BillLine();
    lineSplitUntaxed.name = "Split, untaxed";
    lineSplitUntaxed.amount = new Big(40.95);
    lineSplitUntaxed.split = true;
    lineSplitUntaxed.taxRate = 0;
    bill.lines.push(lineSplitUntaxed);
});

afterEach(() => {
    bill = null;
});

function _accumulate(currencies) {
    let total = new Big(0);
    for (const item of currencies) {
        total = total.plus(item);
    }
    return total;
}

test('Toted properly', () => {
    const totals = bill.total();

    expect(totals.generalTotal.round(2)).toEqual(new Big(64.07));
    expect(totals.usageTotal.round(2)).toEqual(new Big(84.77));
    expect(totals.total().round(2)).toEqual(new Big(148.83));
});


test('Split properly', () => {
    // Setup person periods
    const personPeriods = [];
    const personNames = [];
    const personOneWeekName = "Person present one week";
    personNames.push(personOneWeekName);
    const personOneWeek = new PersonPeriod(personOneWeekName, Interval.fromDateTimes(
        DateTime.local(2020, 1, 8),
        DateTime.local(2020, 1, 14).plus({days: 1})
    ));
    personPeriods.push(personOneWeek);

    const personTwoWeeksName = "Person present two weeks";
    personNames.push(personTwoWeeksName);
    const personTwoWeeks1 = new PersonPeriod(personTwoWeeksName, Interval.fromDateTimes(
        DateTime.local(2020, 1, 7),
        DateTime.local(2020, 1, 12).plus({days: 1})
    ))
    const personTwoWeeks2 = new PersonPeriod(personTwoWeeksName, Interval.fromDateTimes(
        DateTime.local(2020, 1, 21),
        DateTime.local(2020, 1, 27).plus({days: 1})
    ))
    personPeriods.push(personTwoWeeks1, personTwoWeeks2);
    const personAbsentName = "Person absent";
    personNames.push(personAbsentName);

    const results = bill.split(Interval.fromDateTimes(
        DateTime.local(2020, 1, 1),
        DateTime.local(2020, 1, 31).plus({days: 1})
    ), personPeriods, personNames);
    // Extract the results for easier comparisons
    const portions = new Map();
    for (const portion of results) {
        portions.set(portion.name, portion);
    }

    // Test all persons are in the result
    expect(results.length).toBe(3);
    expect(portions.has(personOneWeekName)).toBeTruthy();
    expect(portions.has(personTwoWeeksName)).toBeTruthy();
    expect(portions.has(personAbsentName)).toBeTruthy();

    // Hand-calculated results
    expect(_accumulate([
        portions.get(personOneWeekName).total(),
        portions.get(personTwoWeeksName).total(),
        portions.get(personAbsentName).total(),
    ]).round(2)).toEqual(new Big(148.83));
    expect(portions.get(personOneWeekName).usageTotal.round(2)).toEqual(new Big(26.89));
    expect(portions.get(personOneWeekName).generalTotal.round(2)).toEqual(new Big(21.36));
    expect(portions.get(personOneWeekName).total().round(2)).toEqual(new Big(48.24));
    expect(portions.get(personTwoWeeksName).usageTotal.round(2)).toEqual(new Big(43.29));
    expect(portions.get(personTwoWeeksName).generalTotal.round(2)).toEqual(new Big(21.36));
    expect(portions.get(personTwoWeeksName).total().round(2)).toEqual(new Big(64.65));
    expect(portions.get(personAbsentName).usageTotal.round(2)).toEqual(new Big(14.58));
    expect(portions.get(personAbsentName).generalTotal.round(2)).toEqual(new Big(21.36));
    expect(portions.get(personAbsentName).total().round(2)).toEqual(new Big(35.94));
});
