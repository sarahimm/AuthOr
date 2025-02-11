var innerW, canvasH, c, tBase, tCar, tTop;
var pageW, pageH, pageOffset, pageX, pageY, imgX, imgY, imgW, imgH;
var pageBuffer, eraser, promptField, sysPromptField, autofill;


function preload(){
  tBase = loadImage("img/Typewriter-base.png");
  tCar = loadImage("img/Typewriter-carriage.png");
  tTop = loadImage("img/Typewriter-top.png");
  logo = loadImage("img/logo.png");
//  bkgd = loadImage("background.jpg");
}
function setup() {
  canvasH=window.innerHeight;
  canvasW=window.innerWidth;
  innerW=min(canvasW, 1.5*canvasH);
  marginL=0.5*(canvasW - innerW);
  c=createCanvas(canvasW, canvasH);
  
  imgX = (-.2 * innerW) + marginL;
  imgY = canvasH - innerW * .6;
  imgW = 1.5 * innerW;
  imgH = innerW;
  
  pageW = 0.42 * innerW;
  pageH = 0.15 * innerW;
  pageOffset = -.48 * pageW;
  pageX = (0.285 * innerW) + marginL;
  pageY = canvasH - 0.37 * innerW;
  
  pageBuffer=createGraphics(pageW, canvasH, P2D);
  pageBuffer.rect(0, 0,pageW, canvasH);
  
  document.getElementById("savePage").addEventListener('click', function () {
    pageBuffer.save();
  });

  lineH = 15;
  pageBuffer.textSize(11);
  pageBuffer.textFont('Courier');
  cursorUnit = textWidth('a');
  eraser=color(245);
  eraser.setAlpha(150);
  strokeWeight(0);

  sysPromptField = document.getElementById('systemPrompt');
  promptField = document.getElementById('prompt');
  autofill = document.getElementById('autofill');
}

function draw() {
  noStroke();
  background('AntiqueWhite');
 // image(bkgd, -0.1 * imgW, -0.2 * imgH, imgW, imgH);
  blendMode(MULTIPLY);
  image(logo, 0, 15, 180, 100);
  blendMode(BLEND);
  image(tBase, imgX, imgY, imgW, imgH);
  copy(pageBuffer, 0, 0, int(pageW), int(pageH), int(pageX - pageOffset), int(pageY), int(pageW), int(pageH));
  image(tCar,  imgX-pageOffset - 0.008 * innerW, imgY, imgW, imgH);
  image(tTop,  imgX, imgY, imgW, imgH);
}

function keyTyped(){
  if(document.activeElement === promptField || document.activeElement === sysPromptField){
    return;
  }
  if( key==="Enter"){
   pageOffset = -.48 * pageW;
   return false;
  }
  else{
    pageBuffer.fill(0);
    newchar=key;
    if(pageOffset < pageW * 0.48){
      pageBuffer.text(newchar,(0.5*pageW) + pageOffset, pageH - 15);
      pageOffset += cursorUnit;
    }
    if(autofill.checked){
      promptField.value+=newchar;
    }
    return false;
  }
}

function keyPressed(){
  if(document.activeElement === sysPromptField || document.activeElement === promptField ){
    return;
  }
  if(key==='Control'){
    if (autofill.checked){
      autofill.checked = false;
      document.getElementById("recordingLight").style.background = "none";
      document.getElementById("recordingLight").style.boxShadow = "0px 0px 0px red";
    }else{
      autofill.checked = true;
      document.getElementById("recordingLight").style.background = "red";
      document.getElementById("recordingLight").style.boxShadow = "0px 0px 3px red";
    }
    return false;
  }
  if(key=== 'Tab'){
    printCompletions((0.5*pageW) + pageOffset, pageH-15);
    return false;
  }
  if (key ==='Backspace'){
    pageBuffer.fill(eraser);
    pageBuffer.noStroke();
    pageBuffer.blendMode(LIGHTEST);
    if(pageOffset > -0.48 * pageW){
      pageBuffer.rect((0.5*pageW) + pageOffset - cursorUnit, pageH - 30, cursorUnit, 20); 
      pageOffset -= cursorUnit;
    }
    pageBuffer.blendMode(BLEND);
    if(autofill.checked){
      //Finish!
    }
  }
  else if(key==='ArrowLeft'){
      move(37, 500);
  }
  else if(key==='ArrowRight'){
    move(39, 500);
  }
  else if(key==='ArrowUp'){
    move(38, 500);
  }
  else if(key==='ArrowDown'){
    move(40, 500);
  }
}

function move(keycode, wait){
  if(keyIsDown(keycode)){
    if(keycode==37){ //Left
      if(pageOffset > pageW * -0.48){
        pageOffset -= cursorUnit;
      }
    }else if (keycode==39){ //Right
      if(pageOffset < pageW * 0.48){
        pageOffset += cursorUnit;
      }
    }else if (keycode==38){ //Up
      if(pageY < canvasH - 0.27 * innerW){
        pageY += 0.5 * lineH;
        pageH -= 0.5 * lineH;
      }
    }else if (keycode==40){ //Down
      if(pageY > 20){
        pageY -= 0.5 * lineH;
        pageH += 0.5 * lineH;
      }
    }
    setTimeout(function(){move(keycode, max(50,.7 *wait));}, wait);
  }
  return;
}

async function printCompletions(x,y,num){
  choices = await getCompletions();
  y2 = y + lineH * 0.5 * (1 - choices.length);
  x2 = x + 2 * cursorUnit;
  for(var choice of choices){
    pageBuffer.stroke(0);
    pageBuffer.strokeWeight(1);
    pageBuffer.noFill();
    pageBuffer.bezier(x,y - 0.2*lineH,x2,y - 0.2*lineH,x,y2 - 0.2*lineH,x2,y2 - 0.2*lineH);
    pageBuffer.fill(0,200,0);
    pageBuffer.strokeWeight(0);
    let linex = x2;
    for(var cha of choice){ 
      pageBuffer.text(cha,linex,y2);
      linex += cursorUnit;
    }
    y2 += lineH;
  }
  pageOffset += cursorUnit * (2+choices[choices.length -1].length);
  pageY -= 0.5 * (choices.length - 1) * lineH;
  pageH += 0.5 * (choices.length - 1) * lineH;
}

async function getCompletions(){
  updateParams();
  address="http://127.0.0.1:5000/api/query?msg=";
  address+=encodeURIComponent(userPrompt);
  promptField.value="";
  address+="&sysPrompt="+encodeURIComponent(sysPrompt);
  address+="&numOptions="+encodeURIComponent(numOptions);
  address+="&numTokens="+encodeURIComponent(numTokens);
  address+="&temp="+encodeURIComponent(temp);
  let response = await fetch(address);
  let reply = await response.json();
  let array = [];
  for(var choice of reply.choices){
    array.push(choice);
  }
  while(array.length < numOptions){
    array.push("Error");
  }
  return array;
}

function updateParams(){
  sysPrompt = document.getElementById("systemPrompt").value; 
  userPrompt = document.getElementById("prompt").value; 
  numOptions = document.getElementById("numOptions").value; 
  numTokens = document.getElementById("maxTokens").value; 
  temp = document.getElementById("temperature").value;
}