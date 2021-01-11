import Big from "big.js";

export class PersonPeriod {
    constructor(name, period) {
        this.name = name;
        this.period = period;
    }
}

export class BillLine {
    constructor() {
        this.name = '';
        this.taxRate = 0.0;
        this.amount = new Big(0);
        this.split = true;
    }
}

export class SplitBill {
    constructor(usageTotal, generalTotal) {
        this.usageTotal = usageTotal;
        this.generalTotal = generalTotal;
    }

    total() {
        return this.usageTotal.add(this.generalTotal);
    }
}

export class BillPortion extends SplitBill {
    constructor(name, usageTotal, generalTotal) {
        super(usageTotal, generalTotal);
        this.name = name;
    }
}

export class Bill {
    constructor() {
        this.lines = [];
    }

    static _applyTax(lines) {
        for (const line of lines) {
            line.amount = line.amount.times(line.taxRate + 1);
        }
    }

    static _accumulate(lines) {
        let total = new Big(0);
        for (const line of lines) {
            total = total.plus(line.amount);
        }
        return total;
    }

    total() {
        if (this.lines.length === 0) {
            return new SplitBill(new Big(0), new Big(0));
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

    split(period, personPeriods, names) {
        if (names.length === 0) {
            return [];
        }

        const totals = this.total();
        // How much money presence on a certain day costs
        const usagePart = totals.usageTotal.div(period.length('days'));
        const periodDays = Array.from(function* () {
            for (let offset = 0; offset < period.length('days'); ++offset) {
                yield period.start.plus({'days': offset});
            }
        }());

        // First pass: Determine how many parts each day must be split into.
        const dayParts = new Map();
        // Days where no person was present, so usage shall be distributed evenly.
        let everyoneUsageDays = 0;
        for (const day of periodDays) {
            let dayPartCount = 0;
            for (const personPeriod of personPeriods) {
                if (personPeriod.period.contains(day)) {
                    dayPartCount++;
                }
            }
            if (dayPartCount === 0) {
                dayPartCount = names.length;
                everyoneUsageDays++;
            }
            dayParts.set(day, dayPartCount);
        }

        // Everyone will have this amount added to their usage portion to account for days when no one was present.
        const everyoneUsageAmount = usagePart.div(names.length).times(everyoneUsageDays);

        // Second pass: divide the amount into chunks for each day, then divide those chunks into parts for
        // each user present on that day.  The end result of this is that presence on a given day costs a
        // certain amount.
        const dayUsageAmounts = new Map();
        for (const day of periodDays) {
            dayUsageAmounts.set(day, usagePart.div(dayParts.get(day)));
        }

        // Third pass: total each user's contribution.
        const generalPortion = totals.generalTotal.div(names.length);
        const portions = [];
        for (const person of names) {
            let usagePortion = new Big(0).plus(everyoneUsageAmount);
            for (const personPeriod of personPeriods) {
                if (personPeriod.name !== person) {
                    continue;
                }
                for (const day of periodDays) {
                    if (!personPeriod.period.contains(day)) {
                        continue;
                    }
                    usagePortion = usagePortion.plus(dayUsageAmounts.get(day));
                }
            }
            portions.push(new BillPortion(person, usagePortion, generalPortion));
        }

        return portions;
    }
}
