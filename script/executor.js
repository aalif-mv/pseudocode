
function execute(code) {
    const MEMORY = {};
    const SMEMORY = {};
    const ACC = [];
    const PC = [0];
    let exceptions = false;
    function getData(exp){
        let value;
        value = exp.slice(2, exp.length-1);
        console.log(value, exp)
        if (exp[0] == '~') {
            value = /^true$/i.test(value);
        } else if (exp[0] == '%') {
            value = parseInt(value);
        } else if (exp[0] == '$') {
            value = parseFloat(value);
        } else if (exp[0] == 'A') {
            value = exp.slice(1, exp.length);
            value = MEMORY[value][0];
        } else if (exp[0] == '/') {
            // date
        }
        console.log(value)
        return value;
    }
    function parseInput(exp, input) {
        let type = MEMORY[exp.slice(1, exp.length)][1];
        // let value = MEMORY[exp.slice(1, exp.length)][0];
        let result;
        switch (type) {
            case 'INT':
                result = parseInt(input);
                break;
            case 'FLT':
                result = parseFloat(input);
                break;
            case 'BOL':
                result = /^true$/i.test(input);
                break;
            case 'STR':
                result = input+'';
                break;
            default:
                break;
        }
        return result;
    }
    async function loop() {
        const line = code[PC[0]].trim();
        let segments = line.split(' ');
        switch (segments[0]) {
            case 'DEC':
            {
                if (segments.length >= 4) {
                    let bounds = line.split('ARR')[1].trim().split(' ');
                    let temp = createEmptyArray(bounds);
                    MEMORY[segments[1].slice(1, segments[1].length)] = [temp,segments[2]];
                } else {
                    MEMORY[segments[1].slice(1, segments[1].length)] = [undefined,segments[2]];
                }
            }
                break;
            case 'STO':
            {
                let index = segments[1].slice(1, segments[1].length);
                let type = segments[segments[1].length-1];
                if (type == 'ARR') {
                    let value = segments[2];
                    let locationTrail = [];
                    let arr = MEMORY[index][0];
                    let tempArr = arr;
                    for (let i = 3; i < segments.length; i++) {
                        const aIndex = segments[i].slice(1, segments[i].length);
                        locationTrail.push([tempArr[aIndex], aIndex]);
                        tempArr = tempArr[aIndex];
                    }
                    locationTrail[locationTrail.length-1] = [getData(value), locationTrail[locationTrail.length-1][1]];
                    for (let i = locationTrail.length-1; i > 0; i--) {
                        let lastE = locationTrail.pop();
                        locationTrail[i-1][0][[lastE[1]]] = lastE[0];
                    }
                    let partStored = locationTrail.pop()
                    MEMORY[index][0][partStored[1]] = partStored[0];
                    console.table(MEMORY[index]);
                } else {
                    let value = segments;
                    console.log(value);
                    value.splice(0, 2);
                    value.pop();
                    value = value.join(' ');
                    MEMORY[index][0] = getData(value);
                }
            }
                break;
            case 'INP':
                let index = segments[1].slice(1, segments[1].length);
                let val = await cInput();
                let fVal = parseInput(segments[1], val);
                MEMORY[index][0] = fVal;
                break;
            case 'OUT':
            {
                let outputValue = getData(segments[1]);
                cPrint(outputValue, segments[2]);
            }
                break;
            case 'JPN':
                if (ACC[0] == true) {
                    PC[0] = segments[1];
                }
                break;
            case 'JPE':
                if (ACC[0] == false) {
                    PC[0] = segments[1];
                }
                break;
            case 'JMP':
                PC[0] = segments[1];
                break;
            case 'CMP':
                ACC[0] = true;
                break;
            default:
                break;
        
        }
        PC[0] += 1;
        if (PC[0] < code.length && !exceptions) {
            loop();
        }
    }
    if (PC[0] < code.length && !exceptions) {
        loop();
    }
    // while (PC[0] < code.length && !exceptions) {
    //     const line = code[PC[0]].trim();
    //     let segments = line.split(' ');
    //     switch (segments[0]) {
    //         case 'DEC':
    //         {
    //             if (segments.length >= 4) {
    //                 let bounds = line.split('ARR')[1].trim().split(' ');
    //                 let temp = createEmptyArray(bounds);
    //                 MEMORY[segments[1].slice(1, segments[1].length)] = [temp,segments[2]];
    //             } else {
    //                 MEMORY[segments[1].slice(1, segments[1].length)] = [undefined,segments[2]];
    //             }
    //         }
    //             break;
    //         case 'STO':
    //         {
    //             let index = segments[1].slice(1, segments[1].length);
    //             let value = segments[2];
    //             if (segments.length > 3) {
    //                 let locationTrail = [];
    //                 let arr = MEMORY[index][0];
    //                 let tempArr = arr;
    //                 for (let i = 3; i < segments.length; i++) {
    //                     const aIndex = segments[i].slice(1, segments[i].length);
    //                     locationTrail.push([tempArr[aIndex], aIndex]);
    //                     tempArr = tempArr[aIndex];
    //                 }
    //                 locationTrail[locationTrail.length-1] = [getData(value), locationTrail[locationTrail.length-1][1]];
    //                 for (let i = locationTrail.length-1; i > 0; i--) {
    //                     let lastE = locationTrail.pop();
    //                     locationTrail[i-1][0][[lastE[1]]] = lastE[0];
    //                 }
    //                 let partStored = locationTrail.pop()
    //                 MEMORY[index][0][partStored[1]] = partStored[0];
    //                 console.table(MEMORY[index][0]);
    //             } else {
    //                 MEMORY[index][0] = getData(value);
    //             }
    //         }
    //             break;
    //         case 'INP':
    //             // 
    //             break;
    //         case 'OUT':
    //         {
    //             let outputValues = [];
    //             for (let i = 1; i < segments.length; i++) {
    //                 const out = segments[i];
    //                 outputValues.push(getData(out));
    //             }
    //             cPrint(outputValues.join(' '));
    //         }
    //             break;
    //         case 'JPN':
    //             if (ACC[0] == true) {
    //                 PC[0] = segments[1];
    //             }
    //             break;
    //         case 'JPE':
    //             if (ACC[0] == false) {
    //                 PC[0] = segments[1];
    //             }
    //             break;
    //         case 'JMP':
    //             PC[0] = segments[1];
    //             break;
    //         case 'CMP':
    //             ACC[0] = true;
    //             break;
    //         default:
    //             break;
        
    //     }
    //     PC[0] += 1;
    // }
}