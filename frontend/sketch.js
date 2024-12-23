function preload() {

}

function setup() {
  canvasH = 1000;
  canvasW = 1000;
  createCanvas(canvasW, canvasH);
  lineH = 20;
  textSize(12);
  textFont('Courier New');
  cursorUnit = textWidth('i') + 2;
  eraser=color(245);
  eraser.setAlpha(190);
  strokeWeight(0);
  cursorx = 2*cursorUnit;
  cursory = 60;
  background(256);
  userText="";
  form1 = document.getElementById("systemPrompt");
  form2 = document.getElementById("prompt");
}

function draw() {

}

function keyTyped(){
  if(document.activeElement === form1 || document.activeElement === form2 ){
    return;
  }
  if( key==="Enter"){
    eraseCursor();
    cursorx = 2*cursorUnit
    cursory +=3 *lineH;
    showCursor();
    userText+=" "
  }
  else{
    eraseCursor();
    fill(0);
    newchar=key;
    if((textWidth(newchar+cursorx))>(canvasW-(2*cursorUnit))){
      cursorx = 2*cursorUnit;
      cursory += 60;
    }
    text(newchar,cursorx,cursory);
    cursorx += cursorUnit;
    showCursor();
    userText += key;
  }
}

function keyPressed(){
  if(document.activeElement === form1 || document.activeElement === form2 ){
    return;
  }
  if(key=== 'Tab'){
    printCompletions(cursorx,cursory);
    return false;
  }
  else if (key ==='Backspace'){
    eraseCursor();
    fill(eraser);
    blendMode(LIGHTEST);
    delW = cursorUnit
    if(cursorx > delW){
      rect(cursorx - delW,cursory - 16, delW, 20);
      cursorx -= delW;
    }else{
      rect(0, cursory - 16,cursorx,20);
      rect(canvasW - (delW - cursorx), cursory-56,(delW- cursorx), 20);
      cursory -=60;
      cursorx = canvasW - (delW - cursorx);
    }
    cursorx=max(cursorx, 2*cursorUnit);
    blendMode(BLEND);
    showCursor();
  }
  else if(key==='ArrowLeft'){
    eraseCursor();
    cursorx = max(2*cursorUnit, cursorx-cursorUnit);
    showCursor();
  }
  else if(key==='ArrowRight'){
    eraseCursor();
    cursorx = min(canvasW, cursorx+cursorUnit);
    showCursor();
  }
  else if(key==='ArrowUp'){
    eraseCursor();
    cursory= max(20,cursory-20);
    showCursor();
  }
  else if(key==='ArrowDown'){
    eraseCursor();
    cursory= min(canvasH, cursory+20);
    showCursor();
  }
}

function eraseCursor(){
  fill(256);
  rect(cursorx - 2,cursory-16,3,20);
}

function showCursor(){
  fill(0);
  rect(cursorx-1,cursory-16,1,20);
}

async function printCompletions(x,y){
  eraseCursor();
  stroke(0);
  strokeWeight(1);  
  bezier(x,y-5,x+2*cursorUnit,y-5,x,y-45,x +2*cursorUnit ,y-45);
  bezier(x,y-5,x+2*cursorUnit,y-5,x,y-25,x +2*cursorUnit ,y-25);
  bezier(x,y-5,x+2*cursorUnit,y-5,x,y-5,x +2*cursorUnit ,y-5);
  bezier(x,y-5,x+2*cursorUnit,y-5,x,y+15,x +2*cursorUnit ,y+15);
  bezier(x,y-5,x+2*cursorUnit,y-5,x,y+35,x +2*cursorUnit ,y+35);
  x +=2*cursorUnit;
  fill(0,200,0);
  strokeWeight(0);
  choices = await getCompletions();
  y -= 40;
  for(var choice of choices){
    linex=x;
    for(var cha of choice){
      text(cha,linex,y);
      linex += cursorUnit;
    }
    y+=20;
  }
  cursorx += cursorUnit * choices[2].length;
  cursory = y;
  showCursor();
}

async function getCompletions(){
  let response = await fetch("http://127.0.0.1:5000/api/query?msg=" + userText);
  let reply = await response.json();
  let array = [];
  for(var choice of reply.choices){
    array.push(choice);
  }
  while(array.length < 5){
    array.push("Error");
  }
  return array;
}