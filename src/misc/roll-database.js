// Creates a JSON output with a database of roll results with different parameters
// Used by Roller to calculate the luck score.

var data4 = {
    "s-1": 0,
    "s0": 0,
    "s1": 0,
    "s2": 0,
    "s3": 0,
    "s4": 0,
    "s5": 0,
    "s6": 0,
    "s7": 0,
    "s8": 0,
    "s9": 0,
    "s10": 0
};

var data3 = {
    "nospec": JSON.parse(JSON.stringify(data4)),
    "spec": JSON.parse(JSON.stringify(data4)),
};

var data2 = {
    2: JSON.parse(JSON.stringify(data3)),
    3: JSON.parse(JSON.stringify(data3)),
    4: JSON.parse(JSON.stringify(data3)),
    5: JSON.parse(JSON.stringify(data3)),
    6: JSON.parse(JSON.stringify(data3)),
    7: JSON.parse(JSON.stringify(data3)),
    8: JSON.parse(JSON.stringify(data3)),
    9: JSON.parse(JSON.stringify(data3)),
    10: JSON.parse(JSON.stringify(data3)),
}

var data = {
    1: JSON.parse(JSON.stringify(data2)),
    2: JSON.parse(JSON.stringify(data2)),
    3: JSON.parse(JSON.stringify(data2)),
    4: JSON.parse(JSON.stringify(data2)),
    5: JSON.parse(JSON.stringify(data2)),
    6: JSON.parse(JSON.stringify(data2)),
    7: JSON.parse(JSON.stringify(data2)),
    8: JSON.parse(JSON.stringify(data2)),
    9: JSON.parse(JSON.stringify(data2)),
    10: JSON.parse(JSON.stringify(data2)),
    11: JSON.parse(JSON.stringify(data2)),
    12: JSON.parse(JSON.stringify(data2)),
    13: JSON.parse(JSON.stringify(data2)),
    14: JSON.parse(JSON.stringify(data2)),
    15: JSON.parse(JSON.stringify(data2)),
}

// output = JSON.stringify(data);
// document.write(output);

for (var dice = 1; dice <= 15; dice++) {
    for (var diff = 2; diff <= 10; diff++) {
        for (var spec = 0; spec <= 1; spec++) {
            var successes;
            var tens;
            var ones;
            var result;
            var die;

            for (var i = 1; i <= 10000; i++) {
                successes = 0;
                tens = 0;
                ones = 0;
                for (var j = 1; j <= dice; j++) {
                    die = getRandomInt(10) + 1;

                    if (die == 10) {
                        tens++;
                    } else if (die >= diff) {
                        successes++;
                    } else if (die == 1) {
                        ones++;
                    }
                }

                if (ones > 0 && tens + successes == 0) {
                    data[dice][diff][(spec ? "spec" : "nospec")]["s-1"]++;
                } else if (ones >= tens + successes) {
                    data[dice][diff][(spec ? "spec" : "nospec")]["s0"]++;
                } else {
                    for (var j = 1; j <= ones; j = j + 1) {
                        if (successes > 0) {
                            successes--;
                            ones--;
                        } else if (tens > 0) {
                            tens--;
                            ones--;
                        }
                    }
                    if (spec) {
                        result = tens * 2 + successes;
                    } else {
                        result = tens + successes;
                    }
                    
                    if (result < 10) {
                        data[dice][diff][(spec ? "spec" : "nospec")]["s" + result]++;
                    } else {
                        data[dice][diff][(spec ? "spec" : "nospec")]["s10"]++;
                    }
                }
            }
            data[dice][diff][(spec ? "spec" : "nospec")]["s-1"] /= 10000;
            data[dice][diff][(spec ? "spec" : "nospec")]["s0"] /= 10000;
            data[dice][diff][(spec ? "spec" : "nospec")]["s1"] /= 10000;
            data[dice][diff][(spec ? "spec" : "nospec")]["s2"] /= 10000;
            data[dice][diff][(spec ? "spec" : "nospec")]["s3"] /= 10000;
            data[dice][diff][(spec ? "spec" : "nospec")]["s4"] /= 10000;
            data[dice][diff][(spec ? "spec" : "nospec")]["s5"] /= 10000;
            data[dice][diff][(spec ? "spec" : "nospec")]["s6"] /= 10000;
            data[dice][diff][(spec ? "spec" : "nospec")]["s7"] /= 10000;
            data[dice][diff][(spec ? "spec" : "nospec")]["s8"] /= 10000;
            data[dice][diff][(spec ? "spec" : "nospec")]["s9"] /= 10000;
            data[dice][diff][(spec ? "spec" : "nospec")]["s10"] /= 10000;

        }
    }
}

output = JSON.stringify(data);
document.write(output);

console.log(output);

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
