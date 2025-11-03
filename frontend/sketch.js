var innerW, canvasH, c, tBase, tCar, tTop;
var pageW, pageH, pageOffset, pageX, pageY, imgX, imgY, imgW, imgH;
var pageBuffer, eraser, promptField, autofill;
var sysRole, sysAdj, userPrompt, numOptions, numTokens, temp;
var hitSounds = [];
var rtrnSound, scrollSound;
var PRINTING = false;


function preload(){
  tBase = loadImage("img/Typewriter-base.png");
  tCarL = loadImage("img/Typewriter-carriage-lower.png");
  tCar = loadImage("img/Typewriter-carriage.png");
  tTop = loadImage("img/Typewriter-top.png");
  logo = loadImage("img/logo.png");
  BLEH_on = loadImage("img/BLEH-recording.png");
  BLEH_off = loadImage("img/BLEH-recordingOff.png"); 
  table = loadImage("img/marble.png");
  wall = loadImage("img/wall2.png");
  logo = loadImage("img/logo.png");
  hitSounds.push(loadSound('sound/hit1.wav'),loadSound('sound/hit2.wav'),loadSound('sound/hit3.wav'),loadSound('sound/hit4.wav'), loadSound('sound/hit5.wav'), loadSound('sound/hit5.wav'), loadSound('sound/hit5.wav'));
  rtrnSound = loadSound('sound/return.wav');
  scrollSound = loadSound('sound/scroll_cut.mp3');
  completionSound = loadSound('sound/complete.mp3');
  genSound = loadSound('sound/gen.mp3');
}
function setup() {
  canvasW=min(3000,window.innerWidth);
  canvasH=min(.75*canvasW,window.innerHeight);
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
  
  pageBuffer=createGraphics(pageW, pageW * 1.414, P2D);
  pageBuffer.fill(256);
  pageBuffer.noStroke();
  pageBuffer.rect(0, 0,pageW, pageW * 1.414);
  
  document.getElementById("savePage").addEventListener('click', function() {printPage();this.blur()});
  

  document.getElementById("newPage").addEventListener('click', function() {
    pageBuffer.fill(256);
    pageBuffer.rect(0, 0, pageW, .7 * canvasH);
    userPrompt = "";
    promptField.value = "";
    document.getElementById("currentPrompt").innerText = "";
    pageOffset = -.48 * pageW;
    pageY = pageY = canvasH - 0.37 * innerW;
    pageH = pageH = 0.15 * innerW;
    this.blur();
  })
  
  lineH = 17.5;
  fontSize = 14;
  pageBuffer.textSize(12);
  pageBuffer.textFont('Courier');
  cursorUnit = textWidth('a');
  eraser=color(245);
  eraser.setAlpha(150);
  strokeWeight(0);
  document.getElementById("fontUp").addEventListener('click', function() {
    fontSize = min(40, fontSize + 2);
    lineH += 2.5;
    pageBuffer.textSize(fontSize);
    cursorUnit = pageBuffer.textWidth('a');
  })
  document.getElementById("fontDown").addEventListener('click', function() {
    fontSize= max(6, fontSize - 2);
    lineH += 2.5;
    pageBuffer.textSize(fontSize);
    cursorUnit = pageBuffer.textWidth('a');
  })

  promptField = document.getElementById('prompt');
  promptField.value = "";
  autofill = document.getElementById('autofill');

  userPrompt = "";
  angleMode(DEGREES);
}
function windowResized() {
  canvasW=min(3000,window.innerWidth);
  canvasH=min(.75*canvasW,window.innerHeight);
  innerW=min(canvasW, 1.5*canvasH);
  marginL=0.5*(canvasW - innerW);
  resizeCanvas(canvasW,canvasH);
  
  imgX = (-.2 * innerW) + marginL;
  imgY = canvasH - innerW * .6;
  imgW = 1.5 * innerW;
  imgH = innerW;
  
  pageW = 0.42 * innerW;
  pageH = 0.15 * innerW;
  pageOffset = -.48 * pageW;
  pageX = (0.285 * innerW) + marginL;
  pageY = canvasH - 0.37 * innerW;
  
  pageBuffer.resize(pageW, pageW * 1.414)
}

function draw() {
  noStroke();
  background('AntiqueWhite');
  //blendMode(MULTIPLY);
  //image(logo, canvasW - 180, 20, 180, 100);
  blendMode(BLEND);
  fill(60, 40, 25);
  image(wall, -0.5 * canvasW, -0.3 * canvasH, 1.5 * canvasW, 1.5 * canvasH, 0, 0, wall.width, wall.height, COVER);
  quad(-.37*canvasW, 1.56 * canvasH, .04*canvasW, .48*canvasH, .96*canvasW, .48*canvasH, 1.37*canvasW, 1.56 * canvasH);
  image(table,-0.25 * canvasW, .5*canvasH, 1.5* canvasW, canvasH);
  //image(tBase, imgX, imgY, imgW, imgH);
  stroke(0);
  rotate(-5);
  fill(60,15,5);
  rect(.09*canvasW, .37*canvasW, 30, 80);
  rect(5 + .09*canvasW, 20 + .37*canvasW, 10, 40);
  ellipse(15+ 0.09*canvasW, 80 + .37*canvasW, 30,20);
  rect(.25*canvasW, .37*canvasW, 28, 74);
  ellipse(14+ 0.25*canvasW, 74 + .37*canvasW, 28,20);
  fill(70,25,15);
  rect(5 + .09*canvasW, 18 + .37*canvasW, 10, 60);
  rect(5 + .25*canvasW, 19 + .37*canvasW, 10, 50);
  if(autofill.checked){
    image(BLEH_on,0, 0, .28* canvasW, .38 * canvasW);
  }else{
    image(BLEH_off, 0, 0, .28 * canvasW, .38 * canvasW);
  }
  rotate(5);

  image(tCarL,  imgX-pageOffset - 0.008 * innerW, imgY, imgW, imgH);
  copy(pageBuffer, 0, 0, int(pageW), int(pageH), int(pageX - pageOffset), int(pageY), int(pageW), int(pageH));
  image(tCar,  imgX-pageOffset - 0.008 * innerW, imgY, imgW, imgH);
  image(tTop,  imgX, imgY, imgW, imgH);
  fill(120,0,0);
  triangle(0.496*canvasW,imgY + 0.37*imgH,0.496*canvasW+4,imgY + 0.39*imgH,0.496*canvasW-4,imgY + 0.39*imgH)

  image(logo, canvasW-520, canvasH-110, 600, 100);

  if(PRINTING){
    copy(pageBuffer, 0, 0, int(pageW), int(pageW * 1.414), 0, 0, int(.707*window.innerHeight), int(window.innerHeight));
  }
}
function carReturn(){
  if(pageOffset > -.48*pageW){
    pageOffset -= .01*pageW;
    setTimeout(carReturn,5);
  }
  else{
    pageOffset = -.48*pageW;
  }
}
function keyTyped(){
  if(document.activeElement === promptField){
    return;
  }
  if( key==="Enter"){
   rtrnSound.play();
   setTimeout(carReturn, 5);
   return false;
  }
  else{
    pageBuffer.fill(0);
    newchar=key;
    hitSounds[Math.floor(Math.random()*7)].play();
    if(pageOffset < pageW * 0.48){
      pageBuffer.text(newchar,(0.5*pageW) + pageOffset, pageH - 15);
      pageOffset += cursorUnit;
    }
    if(autofill.checked){
      promptField.value+=newchar;
    }
    userPrompt = promptField.value;
    document.getElementById('currentPrompt').innerText = userPrompt;
    return false;
  }
}

function keyPressed(){
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
    hitSounds[Math.floor(Math.random()*6)].play();
    if(pageOffset > -0.48 * pageW){
      pageBuffer.rect((0.5*pageW) + pageOffset - cursorUnit, pageH - 30, cursorUnit, 20); 
      pageOffset -= cursorUnit;
    }
    pageBuffer.blendMode(BLEND);
    if(autofill.checked){
      promptField.value = promptField.value.slice(0,-1);
      document.getElementById('currentPrompt').innerText = promptField.value;
      return false;
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
      if((pageH + .5 * lineH)< pageBuffer.height){
        pageY -= 0.5 * lineH;
        pageH += 0.5 * lineH;
      }
    }
    if(! scrollSound.isPlaying()){
      scrollSound.play();
    }
    setTimeout(function(){
        move(keycode, max(50,.7 *wait));
    }, wait);
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
    pageBuffer.fill(0,108,0);
    pageBuffer.strokeWeight(0);
    let linex = x2;
    for(var cha of choice){ 
      pageBuffer.text(cha,linex,y2);
      linex += cursorUnit;
    }
    y2 += lineH;
  }
  completionSound.play();
  //Move to beginning of middle suggestion
  pageOffset += 2 * cursorUnit;
  //Move to end of bottom suggestion
  //pageOffset += cursorUnit * (2+choices[choices.length -1].length);
  //pageY -= 0.5 * (choices.length - 1) * lineH;
  //pageH += 0.5 * (choices.length - 1) * lineH;
}

async function getCompletions(){
  genSound.play();
  updateParams();
  address="http://127.0.0.1:5000/api/query?msg=";
  address+=encodeURIComponent(userPrompt);
  userPrompt += " ";
  address+="&sysPrompt="+encodeURIComponent("You are a " + sysRole + ". Continue the sentence or line you are given by providing the most " + sysAdj + " next word or phrase.");
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
  genSound.stop();
  return array;
}

function updateParams(){
  sysRole = document.getElementById("role1").value + " " + document.getElementById("role2").value;
  sysAdj = document.getElementById("adjective").value;
  userPrompt = document.getElementById("prompt").value; 
  numOptions = document.getElementById("numOptions").value; 
  numTokens = document.getElementById("maxTokens").value; 
  temp = document.getElementById("temperature").value;
}

function printPage(){
    PRINTING = true;
    resizeCanvas(.707*window.innerHeight, window.innerHeight);
    var dataURL = document.getElementById("defaultCanvas0").toDataURL();
    var winContent ='<!DOCTYPE html><html><head><title>Print page</title></head><body><img src="'+dataURL+'"></body></html>'
    var winPrint = window.open('','','left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    winPrint.document.open();
    winPrint.document.write(winContent);
    winPrint.document.addEventListener('load', function() {
        winPrint.focus();
        winPrint.print();
        winPrint.document.close();
        winPrint.close();
        PRINTING = false;
        resizeCanvas(window.innerWidth, window.innerHeight);
    },true);
}