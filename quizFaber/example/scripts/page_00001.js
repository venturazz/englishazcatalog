//=========================================
// File name: page_NNNNN.js
//-----------------------------------------
// Project : QuizFaber 4.0.20
// Licence : GNU General Public License v3.0
// Author  : Luca Galli
// Email   : info@quizfaber.com
//-----------------------------------------
// Script for NNNNN-th question
//=========================================



$(document).ready(function ()
{
	const questionIndex = 0;
	const questionTime = 0;

	PageLoad(questionIndex, questionTime);

	
});

$(window).on("beforeunload", function ()
{
	PageUnload();
});

$(window).on("scroll", function ()
{
	PageOnScroll();
});


/* Code generated function */
function InitQuestion1()
{
    const type = QMAKE_MULTIANS;
    const questionIndex = 0;
    var weight = DecodeNumber('DEqZbwmk7YU=', 976, 0, 99999);
    var numOfAnswers = 4;
    var question = new Question(type, weight, numOfAnswers);
    question.answers.length = 0;
    question.isSingleAns = true;
    question.shortTextQuestion = "\"Mr Utterson the lawyer was a man of a rugged countenance that was never lighted by a smile; cold, scanty and embarrassed in discourse; backward in sentiment; lean, long, dusty, dreary, and yet somehow lovable\".  This is the beginning of a famous book. Who wrote it ?";
    question.timeToAnswer = 0;
    var choice = GetSingleAnswerChoice(questionIndex);
    if (choice === 0) question.noChoice = true;
    var valuation1 = DecodeNumber('5vZigNhA91g=', 337, -1, 1);
    if (valuation1 === -2) PrintWrongKeyword(questionIndex);
    var answer1 = new Answer((choice == 1 ? 1 : 0), valuation1, 1, 0, '');
    answer1.shortTextAnswer = "David Copperfield, by Charles Dickens";
    answer1.shortTextRemark = "No, the writer was R.J. Stevenson";
    question.answers.push(answer1);
    var valuation2 = DecodeNumber('X3ZsR0KqmaE=', 339, -1, 1);
    if (valuation2 === -2) PrintWrongKeyword(questionIndex);
    var answer2 = new Answer((choice == 2 ? 1 : 0), valuation2, 1, 0, '');
    answer2.shortTextAnswer = "Dr Jekyll and Mr Hyde, by R.J. Stevenson";
    answer2.shortTextRemark = "It isn't very easy.";
    question.answers.push(answer2);
    var valuation3 = DecodeNumber('X3ZsR0KqmaE=', 341, -1, 1);
    if (valuation3 === -2) PrintWrongKeyword(questionIndex);
    var answer3 = new Answer((choice == 3 ? 1 : 0), valuation3, 1, 0, '');
    answer3.shortTextAnswer = "Franckenstein, by Mary Shelley";
    answer3.shortTextRemark = "No, the writer was R.J. Stevenson";
    question.answers.push(answer3);
    var valuation4 = DecodeNumber('KVl+h/hbtW0=', 343, -1, 1);
    if (valuation4 === -2) PrintWrongKeyword(questionIndex);
    var answer4 = new Answer((choice == 4 ? 1 : 0), valuation4, 1, 0, '');
    answer4.shortTextAnswer = "Dracula, by Bram Stoker";
    answer4.shortTextRemark = "No, the writer was  R.J. Stevenson";
    question.answers.push(answer4);
    return question;

}






