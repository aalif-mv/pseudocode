class variableLinker {
    constructor() {
        this.index = 0o00;
        this.variableName = [];
        this.variableNo = [];
        this.customTypeVariables = {};
        this.stack = [];
    }
    addToList(name) {
        let isInList = this.variableName.indexOf(name);
        if (isInList !== -1) {return [this.variableName[isInList], this.variableNo[isInList]];}
        this.index += 1;
        this.variableNo.push(this.index);
        this.variableName.push(name);
        return [name, this.index];
    }
    isCustom(name) {
        return this.customTypeVariables.hasOwnProperty(name);
    }
    addCustomTypes(name, declarations) {
        this.customTypeVariables[name] = [];
        for (let i = 0; i < declarations.length; i++) {
            const element = declarations[i];
            this.customTypeVariables[name].push(element);
        }
    }
    getCustomTypes(name) {
        if (this.isCustom(name)) {
            return this.customTypeVariables[name];
        }
    }
    getCustomTypesReplaced(name, varName) {
        if (this.isCustom(name)) {
            let final = [];
            for (let i = 0; i < this.customTypeVariables[name].length; i++) {
                const element = this.customTypeVariables[name][i];
                final.push(element.replace(name, varName));
            }
            return final;
        }
    }
    getName(index) {
        let i = this.variableNo.indexOf(index.trim());
        return this.variableName[i];
    }
    getIndex(name) {
        let i = this.variableName.indexOf(name.trim());
        return this.variableNo[i];
    }
    isRecorded(name) {
        return (this.variableName.indexOf(name.trim()) != -1);
    }
}
function getType(type) {
    switch (type.toUpperCase()) {
        case 'STRING':
        case 'STR':
            return 'STR';

        case 'INTEGER':
        case 'INT':
            return 'INT';

        case 'REAL':
        case 'FLOAT':
        case 'DOUBLE':
        case 'FLT':
            return 'FLT';

        case 'BOOLEAN':
        case 'BOOL':
        case 'SWITCH':
            return 'BOL';

        case 'DATE':
        case 'DAT':
            return 'DAT';

        case 'ARRAY':
        case 'ARR':
            return 'ARR';

        default:
            return type;
    }
}
function typeFormat(dat, linker, type=null) {
    let data = dat.trim();
    let format = '';
    let typ = '';
    if (type == 'STR' || (data[0] == '"' || data[0] == "'")&&(data[data.length-1] == '"' || data[data.length-1] == "'")) { // surrounded with quotes
        if ((data[0] == '"' || data[0] == "'")&&(data[data.length-1] == '"' || data[data.length-1] == "'")) {
            format = '#['+data.slice(1, data.length-1)+']';
        } else {
            format = '#['+data+']';
        }
        format = format.replaceAll(' ', '‎');
        typ = 'STR';
    } else if (linker.isRecorded(data)) {
        format = 'A'+linker.getIndex(data);
        typ = 'VAR'; // variable
    } else if (data.search(/\b(false)\b/i) != -1 || data.search(/\b(true)\b/i) != -1) {
        format = '~['+data+']';
        typ = 'BOL';
    } else {
        if (data.search(/(\+|\-|\*|\^|\?|\(|\)|\/)/g)!=-1) {
            if (data.search(/\./) != -1) {
                format = '$['+data+']';
                typ = 'FLT';
                console.log(data.search(/\./), data)
            } else {
                format = '%['+data+']';
                typ = 'INT';
            }
        } else if (data.search(/\D/g) == -1) {
            format = '%['+data+']';
            typ = 'INT';
        } else if (data.match(/\D/g).length == 1 && data.search(/\./) != -1) {
            format = '$['+data+']';
            typ = 'FLT';
        } else {
            format = 'NULL';
            typ = 'NULL'
        }

    }
    // TODO: add  date support /
    return [format,typ]
}
function compFormat(dat, linker) {
    let condition = dat.replace(/  +/g, ' ').trim().split(' ');
    condition.shift();
    if ( condition.length != 1) {
        condition.pop();
    }
    condition = condition.join('').trim().replaceAll(/and/gi, '&&').replaceAll(/or/gi, '||').replaceAll(' ', '').trim();
    console.log(condition)
    let brackets = new Stack();
    let final = '';
    for (let i = 0; i < condition.length; i++) {
        let char = condition[i];
        if (char == '(') {
            brackets.push([false, true, i]);
            final += char;

        } if (char == ')') {
            let b = brackets.pop();
            final += char;

        } else if (isNumeric(char) || isAlphabetic(char) || (char == '-' && isNumeric(condition[i+1]))) {
            let result = '';
            let num = '';
            let br = '';
            do {
                br = '';
                let alpha;
                if (isAlphabetic(char)) {
                    alpha = '';
                    do {
                        alpha += char;
                        i++;
                        if (i >= condition.length) {
                            break;
                        } else {
                            char = condition[i]
                        }
                    } while(isAlphabetic(char));
                    result += (num+typeFormat(alpha, linker)[0]);
                    num = '';
                    continue;
                }
                if (char == '(') {
                    brackets.push([false, false, i]);
                }
                if (char == ')') {
                    let b = brackets.pop();
                    if (b[0]== true) {
                        br = ')'; 
                        i++;
                        break;
                    }else if (b[0] == false && b[1] == true) {
                       final =final.slice(0, b[2]) + final.slice(b[2]+1);
                       result = '('+result;
                    }
                }
                num += char;
                i++;
                console.log(char);
                if (i >= condition.length) {
                    break;
                } else {
                    char = condition[i]
                }
            } while(!isLogicOrOperator(char) && i < condition.length);
            i--;
            result += num;
            final += (typeFormat(result,linker)[0]+br);
        } else if (isLogicOrOperator(char)) {
            let sign = char;
            if (i < condition.length && isLogicOrOperator(condition[i+1])) {
                sign+= char;
                i++;
            }
            if (!brackets.isEmpty()) {
                let b = brackets.pop();
                console.log(b)
                brackets.push([true, b[1], b[2]]);
            }
            final += sign;
        }
    }
    return final;
}
class Converter {
    constructor(code, linker){
        this.lineByLine = code.split('\n');
        this.converted = [];
        for (let i = 0; i < this.lineByLine.length; i++) {
            const line = this.lineByLine[i].replace(/  +/g, ' ').trim();
            this.segments = line.split(' ');
            this.fSegment = this.segments[0].toUpperCase();
            this.convertedSegment = '';
            switch (this.fSegment) {
                case 'DECLARE':
                    {
                    let variableNames = line.split(':')[0].split(' ');
                    variableNames.shift();
                    variableNames = variableNames.join('').trim().split(',');
                    let variableTypes = line.split(':');
                    variableTypes.shift();
                    variableTypes = variableTypes.join(':').trim();
                    let lowerCaseVT = variableTypes.split(/of/gi)[0];
                    variableTypes = variableTypes.toUpperCase().split('OF');
                    let variableType = variableTypes[0];
                    if (variableTypes.length == 2) {
                        variableType = variableTypes[1].trim()+' '+variableTypes[0].replaceAll('[', ' ').replaceAll(']', '');
                    }
                    for (let i = 0; i < variableNames.length; i++) {
                        const name = variableNames[i];
                        let varType = [];
                        let temp0 = variableType.split(' ');
                        if (temp0.length >= 2) {
                            varType.push(getType(temp0.shift()));
                            varType.push(getType(temp0.shift()));
                            for (let i = 0; i < temp0.length; i++) {
                                varType.push(temp0[i]);
                            }
                            variableType = varType.join(' ').trim();
                        } else {
                            variableType = getType(variableType);
                            if (linker.isCustom(lowerCaseVT)) {
                                let typeDeclare = linker.getCustomTypesReplaced(lowerCaseVT, name);
                                typeDeclare = typeDeclare.join('\n');
                                let raw = new Converter(typeDeclare, linker);
                                this.converted = this.converted.concat(raw);
                                break;
                            };
                        }
                        let temp = linker.addToList(name);
                        this.convertedSegment = 'DEC A'+temp[1]+' '+variableType;
                        this.converted.push(this.convertedSegment);
                    }
                    
                }
                    break;

                case 'TYPE':
                    {
                        let typeName = line.trim().split(' ')[1];
                        let declarations = [];
                        while (i < this.lineByLine.length) {
                            i += 1;
                            let tLine = this.lineByLine[i].replace(/  +/g, ' ').trim();
                            let _segments = tLine.split(' ');
                            let _fSegment = _segments[0].toUpperCase()
                            if (_fSegment == 'DECLARE') {
                                let variableNames = tLine.split(':')[0].split(' ');
                                variableNames.shift();
                                variableNames = variableNames.join('').trim().split(',');
                                let variableTypes = tLine.split(':');
                                variableTypes.shift();
                                variableTypes = variableTypes.join(':').trim().split('OF');
                                let variableType = variableTypes[0]
                                if (variableTypes.length >= 2) {
                                    variableType =  variableTypes[0] + ' of ' + variableTypes[1];
                                    variableType = variableType.trim();
                                }
                                variableNames.forEach(name => {
                                    variableType = getType(variableType);
                                    declarations.push('Declare '+(typeName+'.'+name)+' : '+variableType);
                                });
                                continue;
                            }
                            _fSegment = _segments.join('').replaceAll(' ', '').trim().toUpperCase();
                            if (_fSegment == 'ENDTYPE') {
                                break;
                            }
                        }
                        linker.addCustomTypes(typeName, declarations);
                    }
                    break;

                case 'INPUT':
                    {
                        let addresses = this.lineByLine[i].replace(/  +/g, ' ').trim().replace(/input/gi, '').split(',');
                        for (let i = 0; i < addresses.length; i++) {
                            const name = addresses[i];
                            this.convertedSegment = 'INP A' + linker.getIndex(name);
                            this.converted.push(this.convertedSegment);
                        }
                    }
                    break;

                case 'OUTPUT':
                    {
                    let outputContent = line.split(' ');
                    outputContent.shift();
                    outputContent = outputContent.join(' ').trim();
                    let outputContent_ = returnFormat(outputContent);
                    console.log(outputContent_);
                    let lineT = '1NL';
                    outputContent_.forEach(e => {
                        this.convertedSegment = ('OUT '+typeFormat(e, linker)[0]+' '+lineT);
                        this.converted.push(this.convertedSegment);
                        if (outputContent_.length >= 2) lineT = '0NL';
                    });
                    break;
                    }
                case 'FOR':
                {
                    let loopIndexVariable = this.segments[1];
                    if (this.segments[1].indexOf('<-') !== -1) {
                        loopIndexVariable = this.segments[1].split('<-')[0];
                    }
                    let values = line;
                    values = values.split('<-')[1].toUpperCase().replace('TO',':').replace('STEP',':').split(':');
                    let temp = linker.addToList(loopIndexVariable);
                    let type = typeFormat(values[0], linker);
                    this.converted.push('DEC A'+temp[1]+' '+getType(type[1]));
                    this.converted.push('STO A'+temp[1]+' '+type[0]);
                    this.converted.push('CMP A'+temp[1]+' <= '+values[1].trim());
                    this.converted.push('JPE [[ENTERHERE]]');
                    linker.stack.push(['FOR', this.converted.length]);
                    
                    let increment = 'ADD A'+temp[1]+' %[1]';
                    if (values.length == 3) {
                        type = typeFormat(values[2], linker);
                        increment = 'ADD A'+temp[1]+ ' ' +type[0];
                    }
                    linker.stack.push(['FOR', this.converted.length, increment, temp[1], values[1]]);
                }
                    break;

                case 'NEXT':
                    {
                        let forLoop = linker.stack.pop();
                        this.converted.push(forLoop[2]);
                        this.converted.push('STO A'+forLoop[3]+' ACC');
                        this.converted.push('CMP A'+forLoop[3]+' <= '+forLoop[4].trim());
                        this.converted.push('JPN '+(forLoop[1]));
                        this.converted[forLoop[1]-1] = this.converted[forLoop[1]-1].replace('[[ENTERHERE]]', this.converted.length);
                    }
                    break;

                case 'REPEAT':
                {
                    linker.stack.push(['REPEAT',this.converted.length]);
                }
                    break;
                case 'UNTIL':
                    {
                        console.log(i)
                        let forLoop = linker.stack.pop();
                        this.converted.push('CMP '+ compFormat(this.lineByLine[i], linker));
                        this.converted.push('JPE '+forLoop[1]);
                    }
                    break;
                case 'WHILE':
                {
                    let convertedCondition = compFormat(this.lineByLine[i], linker);
                    this.converted.push('CMP '+convertedCondition);
                    this.converted.push('JPE [[ENTERHERE]]');
                    linker.stack.push(['WHILE', this.converted.length, convertedCondition]);
                    
                }
                    break;
                case 'ENDWHILE':
                {
                    let whileLoop = linker.stack.pop();
                    this.converted.push('CMP '+whileLoop[2]);
                    this.converted.push('JPN '+whileLoop[1]);
                    this.converted[whileLoop[1]-1] = this.converted[whileLoop[1]-1].replace('[[ENTERHERE]]', this.converted.length);
                }
                    break;

                case 'CASE':
                    //FIXME: jump statements for case not working due to nesting
                    //       So fix the jumping coordinates :)
                    let caseVariable = line;
                    caseVariable = caseVariable.replace(/(of)/gi, ':').split(':')[1];
                    let statements = [];
                    let statementCount = -1;
                    let r = 0;
                    let OTHERWISE = false;
                    while(i < this.lineByLine.length) {
                        i += 1
                        r+=1;
                        let pLine = this.lineByLine[i].replace(/  +/g, ' ').trim();
                        let statement = pLine.split(':');
                        let pSegments = pLine.split(' ').join('');
                        let pfSegment = pSegments.toUpperCase().trim();
                        if (pfSegment == 'ENDCASE') {
                            break;
                        }
                        if (statement.length == 1) {
                            statements[statementCount].push(statement[0]);
                        } else {
                            statementCount += 1;
                            statements.push([]);
                            let otherCase = (statement[0].toUpperCase().replaceAll(' ', '').replaceAll('"', '').replaceAll("'", ""));
                            if (otherCase == 'OTHERWISE') {
                                statements[statementCount].push('AVOID');
                                statements[statementCount].push(statement[1]);
                                OTHERWISE = true;
                            } else {
                                statements[statementCount].push('CMP A'+linker.getIndex(caseVariable)+' = '+typeFormat(statement[0])[0]);
                                statements[statementCount].push(statement[1]);
                            }
                        }
                    
                    }
                    let convertedCode = [];
                    let currentPos = this.converted.length;
                    for (let i = 0; i < statements.length; i++) {
                        const statement = statements[i];
                        let tempSta = [];
                        let wholeSt = [];
                        for (let j = 1; j < statement.length; j++) {
                            const element = statement[j];
                            tempSta.push(element);
                        }
                        
                        let raw = tempSta.join('\n').trim();
                        let code = new Converter(raw, linker);
                        currentPos += (3+code.length);
                        if (statement[0] != 'AVOID') {
                            wholeSt.push(statement[0]);
                            wholeSt.push('JPN '+(currentPos));
                            wholeSt = wholeSt.concat(code);
                            let jmp = (this.converted.length+(r-1)+(3*statements.length));
                            if (OTHERWISE) {
                                jmp = jmp - 3
                            }
                            wholeSt.push('JMP '+jmp);
                        } else {
                            wholeSt = wholeSt.concat(code);
                        }
                        convertedCode = convertedCode.concat(wholeSt);
                    }
                    this.converted = this.converted.concat(convertedCode);
                    break;
                case 'IF':
                    {
                        let condition = this.lineByLine[i].replace(/then+/gi, '');
                        this.converted.push('CMP '+compFormat(condition, linker));
                        this.converted.push('JPE [[ENTERHERE]]');
                        linker.stack.push(['IF', this.converted.length, []]);
                    }
                        break;
                // case 'IF ELSE':
                // case 'ELSE IF':
                case 'IFELSE':
                case 'ELSEIF':
                    {
                        let ifStatement = linker.stack[linker.stack.length-1];
                        let condition = this.lineByLine[i].replace(/then+/gi, '');
                        this.converted.push('JMP [[JUMPTOEND]]');
                        this.converted.push('CMP '+compFormat(condition, linker));
                        this.converted.push('JPE [[ENTERHERE]]');
                        this.converted[ifStatement[1]-1] = this.converted[ifStatement[1]-1].replace('[[ENTERHERE]]', this.converted.length-2);

                        linker.stack[linker.stack.length-1][1] = this.converted.length;
                        linker.stack[linker.stack.length-1][2].push(this.converted.length-2);
                    }
                    break;
                case 'ELSE':
                    {
                        let ifStatement = linker.stack[linker.stack.length-1];
                        this.converted.push('JMP [[JUMPTOEND]]');
                        
                        this.converted[ifStatement[1]-1] = this.converted[ifStatement[1]-1].replace('[[ENTERHERE]]', this.converted.length);
                        linker.stack[linker.stack.length-1][2].push(this.converted.length);
                    }
                    break;
                case 'ENDIF':
                    {
                        let endIf = linker.stack.pop();
                        let forJumpToEnd = endIf[2];
                        if (forJumpToEnd.length == 1) {
                            this.converted[forJumpToEnd[0]] = this.converted[forJumpToEnd[0]].replace('[[ENTERHERE]]', this.converted.length);
                            break;
                        }
                        for (let i = 0; i < forJumpToEnd.length; i++) {
                            const index = forJumpToEnd[i];
                            this.converted[index-1] = this.converted[index-1].replace('[[JUMPTOEND]]', this.converted.length);
                        }
                    }
                    break;
                default:
                    if (line.search('<-') != -1 && line.split('<-')[1].length != 0) {
                        let identifier = line.split('<-')[0];
                        let variableData = line.split('<-')[1].trim();
                        console.log(variableData)
                        if (identifier.search(/(\[[0-9]\])/g) != -1 ) { // is an Array
                            let arrayIndexes = identifier.split('[');
                            let arrayName = arrayIndexes[0];
                            arrayIndexes.shift();
                            arrayIndexes = arrayIndexes.join(' ').replaceAll(']', '').trim().replaceAll(' ', ' -');
                            arrayIndexes = '-'+arrayIndexes;
                            this.convertedSegment = 'STO A'+linker.getIndex(arrayName)+' '+typeFormat(variableData, linker)[0]+' '+arrayIndexes+' ARR';
                            this.converted.push(this.convertedSegment);
                        } else if (identifier.search(/\./g) != -1) { // custom type
                            if (linker.isRecorded(identifier)) {
                                this.convertedSegment = 'STO A'+linker.getIndex(identifier)+' '+typeFormat(variableData, linker)[0]+' CUS';
                                this.converted.push(this.convertedSegment);
                            }
                        } else { // normal assigning
                            this.convertedSegment = 'STO A'+linker.getIndex(identifier)+' '+typeFormat(variableData, linker)[0]+' NRM';
                            this.converted.push(this.convertedSegment);
                        }
                    }
                    break;
            }
        }
        return this.converted;
    }
}