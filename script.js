const Editor = document.getElementById('cEditor');

// const str = `
// Declare name : String
// Declare age : Integer
// declare arr : Array[0:6][0:8] oF string

// age<-20
// name<-"aa"

// repeat
//     input age
//     output name, 98  , 'hello world', true
// until (age=4And6='A2')

// While (age > 19)
//     input name
//     input name
//     input age
// endwhile


// case of name
//     '17':output 'hello'
//     '38':output 'hi'
//     input age
//     output name
//     '19':output age
// end case
// output 'done', 'finish'
// `;

// const str = `
// Type Class
//     Declare floor : int
//     DEclare teachers : Array[0:8] of string
// End Type
// Type Student
//     Declare name : String
//     Declare class : Class
//     Declare grade : integer
//     Declare subjects : Array[0:6][0:8] oF string
// End Type
// Declare name : str
// Declare age : Integer
// declare arr : Array[0:6][0:8] oF string
// Declare Aalif : Student

// age[0]<-2.0
// name[1][8][67]<-"aa"

// repeat
//     output 'in repeat loop'
//     While (age > 19)
//         input name
//         output 'in while loop'
//     endwhile
// until (age=4And6='A2')

// if age>7and4=5 then
//     output 'hii'
// ifelse age=4 and 5=7
//     input age
//     output 78
// else
//     output 'else'
// Endif
// output 'done', 'finish'
// `;
const str = `
Type Class
    Declare floor : int
    DEclare teachers : Array[0:8] of string
End Type
Type Student
    Declare name : String
    Declare class : Class
    Declare grade : integer
    Declare subjects : Array[0:10][0:10] oF string
End Type
Declare name : str
Declare age : Integer
DEclare Aalif : Student

age <- 18
Aalif.class.floor <- 4
Aalif.subjects[0][5] <- 100

if (9+age=3)>7-3and4=5 then
    output 'hii'
endif

output 'done', 'finish'
`;
function runCode() {
    const _console = document.getElementById('console');
    const list = _console.getElementsByTagName('UL')[0];
    let div = document.createElement('DIV');
    div.classList.add('br');
    list.appendChild(div);
    const editor = document.getElementById('cEditor');
    const VarLinker = new variableLinker();
    const converted = new Converter(editor.value, VarLinker);
    console.log(converted.join('\n'));
    console.table(converted)
    execute(converted);
}
// const VarLinker = new variableLinker();
// const converted = new Converter(str, VarLinker);
// console.log(VarLinker);
// console.log(converted.join('\n'));
// console.table(converted)

// execute(converted);
function save(id) {
    CodeManager.save(id);
}
window.onload = function(e) {
    let url = window.location.href;
    let urlSegments = url.split('#');

    CodeManager.init_load('cEditor', urlSegments[1]);
}