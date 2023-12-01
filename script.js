// const startButton = document.getElementById("start-button");
// const resetButton = document.getElementById("reset-button");
const answerButton = document.getElementById("answer-button");
const nextButton = document.getElementById("next-button");
const questionSpan = document.getElementById("question");
const answerSpan = document.getElementById("answer");
const questionIDSpan = document.getElementById("question-id");
const questionArea = document.getElementById("question-area");
const questionIDArea = document.getElementById("question-id-area");

answerButton.disabled = true;
nextButton.disabled = true;

var questionID = 0;
var questions = []; // 問題を格納する配列

window.onload = async (event) => {
    console.log("onload")
    loadCSVFile()
};

// CSVファイルを読み込む関数
async function loadCSVFile() {
    console.log("loadCSVFile")
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "questions.csv", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const csvData = xhr.responseText;
            questions = parseCSV(csvData); // CSVデータを解析して配列に格納
            ready();
        }
    };
    xhr.send();
    return questions;
}

// CSVデータを解析して配列に格納
function parseCSV(csv) {
    const lines = csv.split("\n");
    const result = [];
    const headers = lines[0].split("\t");
    for (let i = 1; i < lines.length; i++) {
        const data = lines[i].split("\t");
        if (data.length === headers.length) {
            const question = data[0];
            const answer = data[1];
            result.push({ question, answer });
        }
    }
    return result;
}

function ready(){
    console.log("ready")
    console.log(questions)
    // startButton.disabled = false;
    // resetButton.disabled = false;
    answerButton.disabled = false;
    nextButton.disabled = false;
    setQuestionAnswer();
}

function setQuestionAnswer(){
    questionIDSpan.innerText = String(questionID);

    question = questions[questionID].question;
    questionSpan.innerText = question;

    answer = questions[questionID].answer;
    answerSpan.innerText = answer;

    questionID += 1;
}


function displayQuestion() {
    if (currentChar < questions[0].question.length) {
        question.innerText += questions[0].question.charAt(currentChar);
        currentChar++;
        setTimeout(displayQuestion, 1000);
    } else {
        clearInterval(countdown);
    }
}

function addPoint(userid, previous_point){
    pointArea = getElementByXpath("/html/body/div/div[2]/div["+String(userid)+"]/div/div[1]/div[2]/h3")
    pointText = pointArea.innerText;
    point = Number(pointText.split(" ")[0])
    point += 1
    pointArea.innerText = String(point) + " pt"
    if(point == previous_point){
        pointArea.style.color = "black"
    }else if(point < previous_point){
        pointArea.style.color = "blue"
    }else{
        pointArea.style.color = "red"
    }
}

function removePoint(userid, previous_point){
    pointArea = getElementByXpath("/html/body/div/div[2]/div["+String(userid)+"]/div/div[1]/div[2]/h3")
    pointText = pointArea.innerText;
    point = Number(pointText.split(" ")[0])
    point -= 1
    if(point < 0){
        point = 0
    }
    pointArea.innerText = String(point) + " pt"
    if(point == previous_point){
        pointArea.style.color = "black"
    }else if(point < previous_point){
        pointArea.style.color = "blue"
    }else{
        pointArea.style.color = "red"
    }


}


function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

answerButton.addEventListener("click", () => {
    console.log("show answer")
    questionArea.style.display = "block";
    questionIDArea.style.display = "none";

});

nextButton.addEventListener("click", () => {
    console.log("next")
    questionArea.style.display = "none";
    questionIDArea.style.display = "block";

    for(let i=1; i<=6; i++){
        let pointArea = getElementByXpath("/html/body/div/div[2]/div["+String(i)+"]/div/div[1]/div[2]/h3")
        pointArea.style.color = "black"
        let removebutton = getElementByXpath("/html/body/div/div[2]/div["+String(i)+"]/div/div[2]/div[2]/button")
        removebutton.setAttribute("onclick", "removePoint("+String(i)+","+String(pointArea.innerText.split(" ")[0])+")")
        let addbutton    = getElementByXpath("/html/body/div/div[2]/div["+String(i)+"]/div/div[2]/div[1]/button")
        addbutton.setAttribute("onclick", "addPoint("+String(i)+","+String(pointArea.innerText.split(" ")[0])+")")
    }
    setQuestionAnswer();
});