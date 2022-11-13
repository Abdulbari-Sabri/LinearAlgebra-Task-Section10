var matrix = [];
var matrixTemp = [];
var pivot = 0;
var m = 0;//Rows
var n = m + 1; //Columns

var menuItem = 0;

document.addEventListener("DOMContentLoaded", function(event) { 
  setMatrixSize();
  MenuItemSelected(menuItem);
});

function MenuItemSelected(item){
  for(let i = 0 ; i <= 4 ; i++){
    if(i === item)
      document.getElementById('div'+i).style.display = 'block';
    else
      document.getElementById('div'+i).style.display = 'none';


    if(item === 0){
      setMatrixSize();
    }
    else if(item === 1){
      setMatrixSizeInverse();
    }
    else if (item === 2){
      setMatrixSizeSR();
    }
    else if(item === 4){
      setMatrixSizeT();
    }

    clearInputs();
  }
}

function resetAll(){
  matrix = [];
  matrixTemp = [];
  pivot = 0;
  m = 0;//Rows
  n = m + 1; //Columns
}

function setMatrixSize(){
    pivot = 0;
    m = Number(document.getElementById('sizeInput').value);
    n = m +1;
    let container = document.getElementById('MatrixInputContainer');

    while(container.firstChild)
      container.removeChild(container.firstChild);  

      for(let i = 0; i < m ; i++){

        container.appendChild(document.createElement('br'));
        
        for(let j = 0; j < n ; j++){

          let input = document.createElement('input');
          input.type = 'number';
          input.className = "valueInput";
          input.id = `input_${i + 1}${j + 1}`;
          container.appendChild(input);

        }
      }

    clearInputs();
}

function getMatrix(){
  let matrix = [];
  for(let i = 0; i < m ; i++){
    let row = [];
    for(let j = 0; j < n ; j++){
      let input_id = `input_${i + 1}${j + 1}`;
      let value = document.getElementById(input_id).value;
      row.push(Number(value));      
    }
    matrix.push(row);
  }
  return matrix;
}

function startGaussJordan(){

    matrix =  getMatrix();
    matrixTemp = matrix;
    printMatrix(matrixTemp);

    for(let i = 0 ; i < m ; i++){     
      for(let j = 0 ; j < m ; j++){
        if(pivot != j){        
          let res = operatePivot(matrixTemp[pivot] , 'R'+(pivot+1) , matrixTemp[j] ,  'R'+(j+1));
          setRow(res , j );         
        }
      }
      printMatrix(matrixTemp);
      pivot++;
    }

    for(let i = 0 ; i < m ; i++){
      let res = divideRow(matrixTemp[i] , matrixTemp[i][i] , ('R'+(i+1)));
      setRow(res , i ); 
    }

    printMatrix(matrixTemp);
    showResult(matrixTemp);
}

function operatePivot(row_a ,name_a , row_b , name_b){
  
  let pivot1 = row_a[pivot];
  let pivot2 = row_b[pivot];
  
  let res = 0;
  
  if (pivot2 === 0)
    return row_b;

  let sum = differentSymbol(pivot1 , pivot2);
  let newRow = [];
  let mult;  
  let str;

  if( ( pivot1 / pivot2 ) % 1 === 0 ) {  
    
    mult =  Math.abs( pivot1 / pivot2 );    
    
    for(let i = 0; i < n ; i ++){
      
      let num1 = row_a[i];
      let num2 = row_b[i];
            
      if(sum){
        res = (mult * num2) + (num1);
        str = '<h2> Operation: ' + mult +''+ name_b + ' + ' + name_a + '</h2>';
      }     
      else {
        res = (mult * num2) - (num1);
        str = '<h2> Operation: ' + mult +''+ name_b + ' - ' + name_a +'</h2>';
      }
         
      newRow.push(res);

    }
    
    outputDOM(str);
    
  }
  else if ( pivot1 !== 0 && ( pivot2 / pivot1 ) % 1 === 0 ) {
    mult =  Math.abs(pivot2 / pivot1);
    for(let i = 0; i < n ; i ++){
      
      let num1 = row_a[i];
      let num2 = row_b[i];
            
      if(sum){
        res = num2 + (mult * num1);
        str = '<h2> Operation: ' + name_b  + ' + ' + mult +''+ name_a + '</h2>';
      }
      else{
        res = num2 - (mult * num1);
        str = '<h2> Operation: ' + name_b  + ' - ' + mult +''+ name_a + '</h2>';  
      }    

      newRow.push(res);
    }
    
    outputDOM(str);
    
  }
  else {
        
    let mult1 = Math.abs(row_a[pivot]);
    let mult2 = Math.abs(row_b[pivot]);
    
    for(let i = 0; i < n ; i ++){
      
      let num1 = row_a[i];
      let num2 = row_b[i];            
    
      if(sum){
        res = (mult1 * num2) + (mult2 * num1);
        str = '<h2> Operation: ' + mult1 +''+name_b  + ' + ' + mult2 +''+name_a + '</h2>';
      }
      else{ 
        res = (mult1 * num2) - (mult2 * num1);
        str = '<h2> Operation:' + mult1 +''+name_b  + ' - ' + mult2 +''+name_a + '</h2>';
      }
      newRow.push(res);
    }
    
    outputDOM(str);
    
  }

  return newRow;
}

function differentSymbol(num1 , num2){
  return (num1 > 0 && num2 < 0 || num1<0 && num2 >0) ? true : false;
}

function setRow(row , row_number){
  for(let i = 0 ; i < n ; i++)
    matrixTemp[row_number][i] = row[i];  
}

function divideRow(row , divider , row_name){
  var res = [];
  outputDOM('<h2> Operation: ' + row_name + "/" + divider + '</h2>')
  for(let i = 0 ; i < n ; i++){
    res.push(row[i]/divider);
  }
  return res;
}

function fixNumber(num){
  return with2Decimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
}

function showResult(matrix){
  for(let i = 0 ; i < m ; i++){
    let str = "X"+(i+1)+": " + fixNumber(matrix[i][n-1]);
    outputDOM('<h3>   ' + str +'</h3>');
  }
}

function printMatrix(matrix){
  for(let i = 0 ; i < m ; i++){
    let str ="";
    for(let j = 0 ; j < n  ; j++){
      str += '<input class="valueInput" disabled="true" value="'+matrix[i][j]+'"/>';      
    }
    str+='<br/>'
    outputDOM(str);
  }
}

function showMatrix(matrix){
  for(let i = 0 ; i < matrix.length ; i++){
    let str ="";
    for(let j = 0 ; j < matrix[0].length  ; j++){
      str += '<input class="valueInput" disabled="true" value="'+matrix[i][j]+'"/>';      
    }
    str+='<br/>'
    outputDOM(str);
  }
}

function outputDOM(str){
  let operationOutput = document.getElementById("operationOutput");
  operationOutput.innerHTML += str;
}

function clearInputs(){
  document.getElementById('MatrixInputContainer').reset();
  document.getElementById('MatrixInputContainer').reset();
  document.getElementById('operationOutput').innerHTML = "";
  document.getElementById('MatrixInputContainer1').reset();
  document.getElementById('MatrixInputContainer2').reset();
  document.getElementById('MatrixOutContainer').reset();
  document.getElementById('MatrixOutContainerT').innerHTML = "";
  document.getElementById('MatrixInputContainer1T').reset();
}
