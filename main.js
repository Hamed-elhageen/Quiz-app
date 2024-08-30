let count_span=document.querySelector(".questions-info .count span");
let spans = document.querySelector(".bullets .spans");
let questionArea=document.querySelector(".question-area");
let answersArea=document.querySelector(".answers-area");
let submitButton=document.querySelector(".submit");
let bullets=document.querySelector(".bullets");
let resutlsContainer=document.querySelector(".results");
let countdownContainer=document.querySelector(".count-down");
let current =0;                  // the index of the question number
let correct_answers=0;
// 1- get questions from json object and parse it to js object                                                                                                                   // when you see a function here go under to see it's body and what is especaily do 
function getQuestions(){
    let myRequest = new XMLHttpRequest();
    myRequest.open('GET',"questions.json",true);
    myRequest.send();
    myRequest.onreadystatechange = function(){
        if(myRequest.readyState===4 && myRequest.status==200){
            let questionsObject=JSON.parse(myRequest.responseText);                              // 2- let all the questions in a js object
            let questionsCount=questionsObject.length;
            createCount(questionsCount);                                                                          //3- the function to add questions count to the page dynamiclly
            addquestiondata(questionsObject[current],questionsCount);                        //4-  the function to add the question and it's answers to the page
            countDown(10,questionsCount);                                                                  //  11- the function for the timer of each question and it must be before clicking the submit button , it must operate when the page open
            submitButton.onclick = function(){                                                             //5-  clicking on submit button
                let rightAnswer=questionsObject[current].right_answer;
                current++;
                checkAnswer(rightAnswer,questionsCount);                                       // 6- check answers function 
                questionArea.innerHTML="";                                                             // 7- this will remove the previous question  
                answersArea.innerHTML="";
                addquestiondata(questionsObject[current],questionsCount);        //8-  and this will add the next question
                handleBullets();                                                                              //9-    // the function to add blue color to the question we standing at " when the index of the bullet = index of the question then give it the blue color"         
                clearInterval(countdownInterval);                                                  //12- and when clicking on submit button when the time  in operatin  it will stop
                countDown(10,questionsCount);                                                    //13-  and it will go to next question and have the time again and so on
                showResults(questionsCount);                                                      //10- show results function
            }
        }
    }
// the function responsible for questions count dynamically and creating the number of bullets dynamically
function createCount(num){
    count_span.innerHTML=num;           // making the questions count dynamic
    for(let i=0;i<num;i++){
        let spanBullet =document.createElement("span");                                                              // creating the bullets dynamic with the questions number 
        spans.appendChild(spanBullet);
        if(i===0){
            spanBullet.className="on";                                       // if i = 0 " we are in the first question so the first bullet will be blue and when we go the next question the next bullet will be blue and so on "
        }
    }
}
// the function responsible for creating the  question and it's answers dynamically from the questionsObject
function addquestiondata(obj,count){
if(current<count){                                                                                                   //here i am saying to him work until the last question , by this after clicking submit at the last question it won't get  an error
    // create the heading " the question" in the question area
    let question=document.createElement("h2");
    let questionText=document.createTextNode(obj.title);
    question.appendChild(questionText);
    questionArea.appendChild(question);
 // create answers and put them into the answer area
    for(let i=1;i<=4;i++){
            // create the maindiv which containing raido input and label 
        let answerDiv = document.createElement("div");
        answerDiv.className="answer";
        let radioInput=document.createElement("input");
        radioInput.type="radio";
        radioInput.name="question";
        radioInput.id=`answer_${i}`;
        radioInput.dataset.answer=obj[`answer_${i}`];                    // getting the answer text from the questionsObject
        // create the label
        let theLabel = document.createElement("label");
        theLabel.htmlFor=`answer_${i}`;                                      // to link the radio with the label
        let labelText=document.createTextNode(obj[`answer_${i}`]);
        theLabel.appendChild(labelText);
        answerDiv.appendChild(radioInput);
        answerDiv.appendChild(theLabel);
        answersArea.appendChild(answerDiv);
    }
}
}
// check answers function
function checkAnswer(ranswer,count){
let answers=document.getElementsByName("question");
let choosenAnswer;
for(let i=0;i<answers.length;i++){
    if(answers[i].checked){
        choosenAnswer = answers[i].dataset.answer;
    }
}
if(ranswer===choosenAnswer){
    correct_answers++;
}
}
function handleBullets(){
    let bullets=document.querySelectorAll(".bullets .spans span")
    let arrayofBullets=Array.from(bullets);
    arrayofBullets.forEach(function(bullet,index){                                                   // the function to add blue color to the question we standing at " when the index of the bullet = index of the question then give it the blue color"
        if(current===index){
            bullet.className="on";
        }
    })
}
function showResults(count){                                                                              // the function to show results after finishing the questions and remove the question and it's answers and the bullets to show the result lonely
    let theResults;
    if(current===count){
        questionArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
        if( correct_answers>(count/2) && correct_answers<count){
            theResults =`<span class="good">good , you scored<span> ${correct_answers} from ${count}`;
        }
        else if( correct_answers===count){
            theResults =`<span class="perfect">perfect , you scored<span> ${correct_answers} from ${count}`;
        }
        else{
            theResults =`<span class="bad">bad , you scored<span> ${correct_answers} from ${count}`;
        }
            resutlsContainer.innerHTML=theResults;
            resutlsContainer.style.backgroundColor="#ffffff";
            resutlsContainer.style.padding="15px";
            resutlsContainer.style.marginTop="15px";
    }
}
function countDown(duration,count) {                                                    
    if(current<count){                                                        // that's mean that the questions hasn't ended
    let minutes,seconds;
    countdownInterval=setInterval(function(){
        minutes=parseInt(duration/60);
        seconds=parseInt(duration%60);
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds <10 ?  `0${seconds}` :  seconds;
        countdownContainer.innerHTML=`${minutes}:${seconds}`;
        if(--duration<0){                                                 
            clearInterval(countdownInterval);                               // here i am saying if the time reduced and arrived at zero and ended stop it 
            submitButton.click();                                                   // and go to next question as clicking the submit button
        }
    },1000)
    }
}
}
getQuestions();