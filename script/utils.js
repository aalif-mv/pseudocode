class Stack {
    constructor() {
        this.data = [];
    }
    push(d) {
        this.data.push(d);
    }
    pop() {
        return this.data.pop();
    }
    peek() {
        return this.data[this.data.length-1];
    }
    isEmpty() {
        return this.data.length == 0;
    }
}
function isLogicOrOperator(v) {
    if (v=='&'||v=='|'||v=='&&' || v=='||' || v=='=' || v=='==' || v=='<' || v=='>' || v=='<=' || v=='>=' || v=='<>'|| v=='!=' || v=='!') {
        return true;
    }
    return false;
}
function isAlphabetic(str) {
    return (str.length === 1 && str.match(/[a-z]/i)!=null);
}
function isNumeric(str) {
    if (str.length != 0) {
        return !isNaN(str); 
    }
    return false;
}

function replaceALL(object, search, replace) {
    let final = object.replaceAll(search, replace);
    return final;
}

function getEmptyArrayObject(u ,l) {
    let result = {};
    for (let i = l; i <= u; i++) {
        result[i] = null;
    }
    return JSON.stringify(result);
}
function createEmptyArray(boundaries) {
    let subject = 'null';
    for (let i = 0; i < boundaries.length; i++) {
        let lowerBound = parseInt(boundaries[i].split(':')[0]);
        let upperBound = parseInt(boundaries[i].split(':')[1]);
        let obj = getEmptyArrayObject(upperBound, lowerBound);
        subject = replaceALL(subject, 'null', obj);
    }
    subject = JSON.parse(subject);
    return subject;
}
function evaluate(e) {
    let degree = false;
	
	function isSCT(c) {
		switch(c) {
			case "COS":
			case "SIN":
			case "TAN":
			case "ACOS":
			case "ASIN":
			case "ATAN":
			case "COSH":
			case "SINH":
			case "TANH":
				return true;
		}
		return false;
	}
	function Pow(n, p, b) {
		ans = 0.0;
		ans = Math.pow(n, p);
		ans = Math.abs(ans);
		if (n < 0) {
			if (b) {
				if (p % 2 != 0) {
					ans *= -1;
				}
			} else {
				ans *= -1;
			}
		}
		return ans;
	}
	function nthRoot(k, n) {
		let root = 0.0;
		let x1;
		if (k < 0 && n%2 != 0) {
			root = Math.pow(n, ((1/n) * (Math.log(Math.abs(k))/(Math.log(n)))));
			root *= -1;
		} else if (k >= 0) {
			root = Math.pow(n, ((1/n) * (Math.log(k)/(Math.log(n)))));
		}
		x1 = ((n-1)/n) * root + (k/n) * 1/(Math.pow(root, n-1));
		return x1;
    }
    function toRadians (angle) {
        return angle * (Math.PI / 180);
    }
	
    // Method to evaluate value of a postfix expression
    	if (e.length == 0) {
    		return "";
    	}
    	
    let expr = e.split(" ");
    
    //create a stack
    let stack = new Stack();
    
    for(i = 0; i < expr.length; i++) {
        c = expr[i];
            
        if(c == " ")
        continue;
        
        else if(isNumeric(c) || (isNumeric(c) && c[0] == '-' && c.length >= 2)) {
            n = parseFloat(c);

            stack.push(n);
        }
            
        else {
            if (isAlphabetic(c[0]) || ( c[0] == '-' && c.length > 1) ) {
                let val1;
                try {
                    val1 = stack.pop();
                } catch(e) {  
                    return "Syntax ERROR";
                }
                fun = c.replace("-", "");
                ans = 0.0;
                if (isSCT(fun) && degree) {
                    val1 = toRadians(val1);
                }
                switch(fun) {
                    case "COS":
                        ans = (Math.cos(val1));
                        break;
                    case "SIN":
                        ans = (Math.sin(val1));
                        break;
                    case "TAN":
                        ans = (Math.tan(val1));
                        break;
                    case "ACOS":
                        ans = (Math.acos(val1));
                        break;
                    case "ASIN":
                        ans = (Math.asin(val1));
                        break;
                    case "ATAN":
                        ans = (Math.atan(val1));
                        break;
                    case "COSH":
                        ans = (Math.cosh(val1));
                        break;
                    case "SINH":
                        ans = (Math.sinh(val1));
                        break;
                    case "TANH":
                        ans = (Math.tanh(val1));
                        break;
                    case "LOG":
                        ans = (Math.log10(val1));
                        break;
                    case "LN":
                        ans = (Math.log(val1));
                        break;
                    case "ABS":
                        ans = (Math.abs(val1));
                        break;
                    case "EXP":
                        ans = (Math.exp(val1));
                        break;
                    default:
                        return "Syntax ERROR";
                }
                if (c.charAt(0) == '-') {
                    ans *= -1;
                }
                stack.push(ans);
                continue;
            }
            let val1;
            let val2;
            try {
                val1 = stack.pop();
                val2 = stack.pop();
            } catch(e) {
                return "Syntax ERROR";
            }  
                
            switch(c) {
                case "+":
                    stack.push(val2+val1);
                    break;
                    
                case "-":
                    stack.push(val2- val1);
                    break;
                    
                case "/":
                    stack.push(val2/val1);
                    break;
                    
                case "*":
                    stack.push(val2*val1);
                    break;
                
                case "^":
                    stack.push(Pow(val2, val1, false));
                    break;
                case "^^":
                    stack.push(Pow(val2, val1, true));
                    break;
                case "?":
                    stack.push(nthRoot(val1, val2));
                    break;
            }
        }
    }
    return (stack.pop()+"");
}
function calculate(eval) {
    function isConstant(o_f_c) {
		switch (o_f_c) {
			case "PI":
				return Math.PI;
		}
		return 0;
	}
    function Prec(ch) {
    	choice = ch;
    	if (ch.length > 1 && ch[0] == '-') {
    		choice = ch.replace("-", "");
    	}
    	
        switch (choice) {
        case "+":
        case "-":
            return 1;
      
        case "*":
        case "/":
            return 2;
      
        case "^":
        case "^^":
        case "?":
            return 3;
            
        case "COS":
        case "SIN":
        case "TAN":
        case "ACOS":
        case "ASIN":
        case "ATAN":
        case "COSH":
        case "SINH":
        case "TANH":
        case "LOG":
        case "LN":
        case "ABS":
        case "EXP":
        	return 4;
        }
        return -1;
    }

    // 
    // 
    let exp = eval.replaceAll(" ", "");
    let result = '';
        
    // initializing empty stack
    let stack = new Stack();
        
    for (i = 0; i < exp.length; i++) {
        c = exp[i];
        
        if (isNumeric(c) || i >= 0 && i+1 < exp.length && c == '-' && isNumeric(exp[i+1])) {
            number = "";
            sign = "";
            if ((c == '-' && i <= 0) || (c == '-' && !isNumeric(exp[i-1]))) {
                sign = "-";
                i++;
                c = exp[i];
            } else if (c == '-') {
                while (!stack.isEmpty() && Prec(c) <= Prec(stack.peek())){
                    
                    result += (stack.pop() + " ");
                }
                stack.push("-");
                continue;
            }
            while( isNumeric(c) || (c == '.' && isNumeric(exp[i+1])) || (isNumeric(exp[i-1]) && c == 'E') || ((c == '-' || c == '+' ) && exp[i-1] == 'E' )) {
                number += c;
                i++;
                if (i >= exp.length) {
                    break;
                } else {
                    c = exp[i];
                }
            }
            i--;
            result += (sign + number + " ");
        } else if (c == '(') {
            stack.push("(");
        } else if (c == ')') {
            while (!stack.isEmpty() && !(stack.peek() == "(")) {
                result += (stack.pop() + " ");
            }
            stack.pop();
        } else {
            operator_function_constant = c;
            sign = "";
            if ((c == '-' && i <= 0) || (c == '-' && !isNumeric(exp[i-1]))) {
                if (isAlphabetic(exp[i+1])) {
                    i++;
                    c = exp[i];
                    sign = "-";
                }
            }
            if (isAlphabetic(c)) {
                operator_function_constant = "";
                while(isAlphabetic(c)) {
                    operator_function_constant += c;
                    i++;
                    if (i >= exp.length) {
                        break;
                    } else {
                        c = exp[i];
                    }
                }
                i--;
                operator_function_constant = operator_function_constant.toUpperCase();
                constant = isConstant(operator_function_constant);
                if (constant != 0) {
                    result += (sign + constant + " ");
                    continue;
                }
                operator_function_constant = sign + operator_function_constant;
            }
            if (c == '^' && exp[i-1] == ')') {
                operator_function_constant = "^^";
            }
            while (!stack.isEmpty() && Prec(operator_function_constant) <= Prec(stack.peek())){
                
                result += (stack.pop() + " ");
            }
            stack.push(operator_function_constant);
        }
    
    }
    
    // pop all the operators from the stack
    while (!stack.isEmpty()){
        if(stack.peek() == "(") {
            stack.pop();
        // if (!stack.isEmpty()) {
        //     return "Invalid Expression";
        // }
        }
        result += (stack.pop() + " ");
    }
    result = result.trim();
    // console.log(result);
    return evaluate(result);
}
// console.log(calculate('213142+242421-2424532/3423423+532532'))
// console.log(calculate('3*(30/26^2)^2-(5?3)+1'))
// console.log(calculate('(2+1)^2'))


function compare(e) {
    function Prec(ch) {
    	choice = ch;
        switch (choice) {
        case "=":
        case "==":
        case "<":
        case ">":
        case "<=":
        case ">=":
        case "<>":
        case "!=":
            return 2;
      
        case "&&":
        case "||":
            return 1;
        }
        return -1;
    }
    function isLogicOrOperator(v) {
        if (v=='&&' || v=='||' || v=='=' || v=='==' || v=='<' || v=='>' || v=='<=' || v=='>=' || v=='<>'|| v=='!=' || v=='!') {
            return true;
        }
        return false;
    }
    let exp = e;
    let results = [];
    for (let i = 0; i < exp.length; i++) {
        let result = '';
        
        let stack = new Stack();

        for (i = 0; i < exp.length; i++) {
            c = exp[i];

            
            if (isNumeric(c) || i >= 0 && i+1 < exp.length && c == '-' && isNumeric(exp[i+1])) {
                number = "";
                sign = "";
                if ((c == '-' && i <= 0) || (c == '-' && !isNumeric(exp[i-1]))) {
                    sign = "-";
                    i++;
                    c = exp[i];
                }
                while( isNumeric(c) || (c == '.' && isNumeric(exp[i+1])) || (isNumeric(exp[i-1]) && c == 'E') || ((c == '-' || c == '+' ) && exp[i-1] == 'E' )) {
                    number += c;
                    i++;
                    if (i >= exp.length) {
                        break;
                    } else {
                        c = exp[i];
                    }
                }
                i--;
                results.push(parseFloat(sign + number));
            } else if (c == '(') {
                stack.push("(");
            } else if (c == ')') {
                while (!stack.isEmpty() && !(stack.peek() == "(")) {
                    results.push(stack.pop());
                }
                stack.pop();
            } else if (isAlphabetic(c)) {
                let str = '';
                while (isAlphabetic(c)) {
                    str += c;
                    i++;
                    if (i >= exp.length) {
                        break;
                    } else {
                        c = exp[i];
                    }
                }
                i--;
                if (str.search(/\b(false)\b/i) != -1 || str.search(/\b(true)\b/i) != -1) {
                    str = (str.toUpperCase() === 'TRUE'); // is a bool
                } else {
                    str = ('"' + str + '"');
                }
                results.push(str);
            } else {
                operator_logic = '';
                
                    operator_logic = "";
                    while(!isNumeric(c) && c != '-'&& !isAlphabetic(c)) {
                        operator_logic += c;
                        i++;
                        if (i >= exp.length) {
                            break;
                        } else {
                            c = exp[i];
                        }
                    }
                    i--;
                while (!stack.isEmpty() && Prec(operator_logic) <= Prec(stack.peek())){
                    
                    results.push(stack.pop());
                }
                stack.push(operator_logic);
            }
        
        }
        
        // pop all the operators from the stack
        while (!stack.isEmpty()){
            if(stack.peek() == "(") {
                stack.pop();
            }
            if (stack.peek() != undefined) {
                results.push(stack.pop());
            }
        }
    }
    let stack1 = new Stack();
    for (let i = 0; i < results.length; i++) {
        if (!(typeof results[i] === 'string' || results[i] instanceof String)) {
            stack1.push(results[i]);
        } else if (typeof results[i] === 'string' && results[i][0] == '"' && results[i][results[i].length-1] == '"') {
            stack1.push(results[i].slice(1, results[i].length));
        } else {
            let val1;
            let val2;
            try {
                val1 = stack1.pop();
                val2 = stack1.pop();
            } catch(e) {
                console.log("Syntax ERROR");
            }
            if (typeof val1 === 'string' && typeof val2 === 'string') {
                switch (results[i]) {
                    case '=':
                    case '==':
                        stack1.push((val1 == val2));
                        break;
                    case '<>':
                    case '!=':
                        stack1.push((val1 != val2));
                        break;
                }
                continue;
            }
            switch (results[i]) {
                case '&&':
                    stack1.push((val1 && val2));
                    break;
                case '||':
                    stack1.push((val1 || val2));
                    break;
                case '<':
                    stack1.push((val2 < val1));
                    break;
                case '>':
                    stack1.push((val2 > val1));
                    break;
                case '<=':
                    stack1.push((val2 <= val1));
                    break;
                case '>=':
                    stack1.push((val2 >= val1));
                    break;
                case '=':
                case '==':
                    stack1.push((val1 == val2));
                    break;
                case '<>':
                case '!=':
                    stack1.push((val1 != val2));
                    break;
            }
        }
    }
    return stack1.pop();
}
function separateLogicAndArithmetic(ex) {
    let result = [];
    let arm = '';
    let exp = ex.trim();
    for (let i = 0; i < exp.length; i++) {
        const c = exp[i];
        if (i+1<exp.length && ((c=='='&&exp[i+1]=='=')||(c=='>'&&exp[i+1]=='=')||(c=='<'&&exp[i+1]=='=')||(c=='!'&&exp[i+1]=='=')||(c=='&'&&exp[i+1]=='&')||(c=='|'&&exp[i+1]=='|')||(c=='<'&&exp[i+1]=='>'))) {
            let v = c+exp[i+1];
            result.push(calculate(arm));
            result.push(v);
            arm = '';
            i++;
        } else if (c == '=' || c=='<' || c=='>' ){
            result.push(calculate(arm));
            result.push(c);
            arm = '';
        } else {
            arm += c;
        }
    }
    result.push(calculate(arm));
    return result.join('');
}

// console.log(compare(separateLogicAndArithmetic('2+3>4||2*5-4=32')))

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
                    result += (num+typeFormat(alpha)[0]);
                    console.log(alpha, char);
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
            final += (typeFormat(result)[0]+br);
            console.log(br, '-----------')
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
function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}


// console.log(compFormat('if ((age+9)+3=3)>7-3and4=hi then'))

function returnFormat(exp) {
    let stack = new Stack();
    let result = [];
    let l_exp = '';
    for (let i = 0; i < exp.length; i++) {
        const l = exp[i];
        if (l == '"' || l == "'") {
            if (stack.peek() == '"' || stack.peek() == "'") {
                if (l == stack.peek()) {
                    stack.pop();
                    result.push("'"+l_exp+"'");
                } else {
                    l_exp += l;
                    continue;
                }
            } else {
                while (!stack.isEmpty() && stack.peek() == ',') {
                    stack.pop();
                }
                stack.push(l);
            }
            l_exp = '';
        } else if (l == ',' && !(stack.peek() == '"' || stack.peek() == "'")) {
            if (stack.peek() == ',') {
                let stk = stack.pop();
                if (l == stk && l_exp !== '') {
                    result.push(l_exp);
                }
            } else {
                stack.push(l);
            }
            l_exp = '';
        } else {
            l_exp += l;
        }
    }
    if (l_exp != '') result.push(l_exp);
    return result;
}

console.log(returnFormat('"hi"'))


function cPrint(text, nl) {
    const console_ = document.getElementById('console');
    const list = console_.getElementsByTagName('UL')[0];
    if (nl == '0NL') {
        let li = document.querySelector("#console > ul > li:last-child");
        li.innerText += (' '+text);
        return;
    }
    let li = document.createElement('LI');
    li.innerText = text;
    list.appendChild(li);
}


function cInput() {
    const console1 = document.getElementById('console');
    const list = console1.getElementsByTagName('UL')[0];
    let li = document.createElement('LI');
    li.setAttribute("contentEditable", true);
    list.appendChild(li);
    return new Promise((resolve) => {
      li.addEventListener('keypress',(e) => {
        if (e.key == 'Enter') {
            let value = li.innerText;
            li.setAttribute("contentEditable", false);
            resolve(value);
        }
      });
    });
  }

const LocalStorageManager = {
    exists: function(id) {
        if (id == undefined || localStorage.getItem(id) === null) {
            return false;
        }
        return true;
    },
    add: function(id, data) {
        if (this.exists(id) == false) {
            localStorage.setItem(id, data);
            return id;
        }
        return false;
    },
    edit: function(id, data) {
        localStorage.setItem(id, data);
    },
    get: function(id) {
        if (this.exists(id) == true) {
            return localStorage.getItem(id);
        } else {
            return 'object with key: "'+id+'" does not exist in the local storage';
        }
    },
    load: function(id) {
        if (this.exists(id) == true) {
            return localStorage.getItem(id);
        } else {
            throw 'object with key: "'+id+'" does not exist in the local storage';
        }
    },
    remove: function(id) {
        if (this.exists(id) == true) {
            localStorage.removeItem(id);
        } else {
            throw 'object with key: "'+id+'" does not exist in the local storage';
        }
    },
    deleteAll: function() {
        localStorage.clear();
    }
}
const CodeManager = {
    save: function(id) {
        let code = document.getElementById(id).value;
        if (LocalStorageManager.exists(window.location.hash.slice(1, window.location.hash.length))) {
            LocalStorageManager.edit(window.location.hash.slice(1, window.location.hash.length), code);
            return true;
        }
        let added = false;
        do {
            added = LocalStorageManager.add(makeId(8), code);
        } while (added == false);
        window.location.hash = '#'+added;
        return false;
    },
    init_load: function(id, key) {
        let editor = document.getElementById(id);
        editor.value = LocalStorageManager.load(key);
    }
}