import {Bill, BillLine, PersonPeriod} from "./calculator";
import currency from "currency.js";
import {DateTime, Interval} from "luxon";

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

function _accumulate(currencies) {
    let total = currency(0);
    for (const item of currencies) {
        total = total.add(item);
    }
    return total;
}

test('Toted properly', () => {
    const totals = bill.total();

    expect(totals.generalTotal).toEqual(currency(64.07));
    expect(totals.usageTotal).toEqual(currency(84.77));
    expect(totals.total()).toEqual(currency(148.84));
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
    ])).toEqual(currency(148.83));
    expect(portions.get(personOneWeekName).usageTotal).toEqual(currency(26.89));
    expect(portions.get(personOneWeekName).generalTotal).toEqual(currency(21.36));
    expect(portions.get(personOneWeekName).total()).toEqual(currency(48.25));
    expect(portions.get(personTwoWeeksName).usageTotal).toEqual(currency(43.30));
    expect(portions.get(personTwoWeeksName).generalTotal).toEqual(currency(21.36));
    expect(portions.get(personTwoWeeksName).total()).toEqual(currency(64.65));
    expect(portions.get(personAbsentName).usageTotal).toEqual(currency(14.58));
    expect(portions.get(personAbsentName).generalTotal).toEqual(currency(21.36));
    expect(portions.get(personAbsentName).total()).toEqual(currency(35.94));
});
