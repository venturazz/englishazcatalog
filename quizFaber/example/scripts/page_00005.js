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

    var listLeft4;
    var listLeftHtml4;
    var listRight4;
    var orderLeft4;
    var orderRight4;



$(document).ready(function ()
{
	const questionIndex = 4;
	const questionTime = 0;

	PageLoad(questionIndex, questionTime);

	    listLeft4 = new CreateListLeft4();
    listLeftHtml4 = new CreateListLeftHtml4();
    listRight4 = new CreateListRight4();
    orderLeft4 = new ShuffleMatchingOrder(listLeft4.length);
    orderRight4 = new ShuffleMatchingOrder(listRight4.length);
    var hideLeftDropdown = false;
    var textHtml = CreateMatchingLists(listLeft4, listLeftHtml4, listRight4, orderLeft4, orderRight4, "idDD4", textSelect, hideLeftDropdown);
    $('#matching4').html(textHtml);
    var maxLeftSize = GetMaxSizeLeftColumn(listLeft4);
    var maxRightSize = GetMaxSizeRightColumn(listRight4);
    var leftWidth = maxLeftSize * 10;
    var rightWidth = maxRightSize * 10;
    ManageMatchingEvents(listLeft4, "idDD4", leftWidth, rightWidth, options.matchingLockLeftCol);
    SetDefaultLeftColumn(listLeft4, "idDD4", hideLeftDropdown);


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
function InitQuestion5()
{
    const type = QMAKE_MATCHING;
    const questionIndex = 4;
    var weight = DecodeNumber('QZRfSmoeLwQ=', 319, 0, 99999);
    var numOfAnswers = 7;
    var i, j;
    var answer;
    var choice, valuation;
    var question = new Question(type, weight, numOfAnswers);
    question.answers.length = 0;
    question.shortTextQuestion = "In this question, you have a list of writers and a list of books title. For each writer says the book that he wrote.";
    question.noChoice = false;
    for (i = 0; i < orderLeft4.length; i++)
    {
        choice = new Array(2);;
        choice[0] = GetSelectedItemLeft("idDD4", i);
        choice[1] = GetSelextedItemRight("idDD4", i);
        if (choice[1]==='') question.noChoice=true;
        valuation = new Array();
        for (j = 0; j < listLeft4.length; j++)
        {
            if (listLeft4[j] === choice[0])
            {
                valuation.push(listRight4[j]);
            }
        }
        answer = new Answer(choice, valuation, 1, 0, '');
        question.answers.push(answer);
    }
    return question;

}


/* Code generated function */
function CreateListLeft4()
{
    this.length = 7;
    this[0] = unescape(DecodeString("hDHZWfalLNDxbGYs"));
    this[1] = unescape(DecodeString("nF62+TZE1rrbOIQD9fh+9Kv/es4="));
    this[2] = unescape(DecodeString("yR3HDfa5veeezEHE0Rg7Wg=="));
    this[3] = unescape(DecodeString("jwt5MVA/NpUbnpseZNVJ+FVugF0="));
    this[4] = unescape(DecodeString("A4NX91dp8hw54rZK"));
    this[5] = unescape(DecodeString("/cMsRp86MtS5T2nX"));
    this[6] = unescape(DecodeString("rqqMRA0s7O3rb5/V4rK3vA=="));

}

/* Code generated function */
function CreateListRight4()
{
    this.length = 7;
    this[0] = unescape(DecodeString("f9y9cy9w+4/t8bCXkj1HuQ=="));
    this[1] = unescape(DecodeString("/khkkAOpTri+oME9jnMpMQ=="));
    this[2] = unescape(DecodeString("EgV6IG9yoMxiykp7kUxsfA=="));
    this[3] = unescape(DecodeString("/uBFFNvc3pQ2RO+zFW5Urg=="));
    this[4] = unescape(DecodeString("uuk0ookw7mKbO8lK"));
    this[5] = unescape(DecodeString("Xni4dmYB3UU="));
    this[6] = unescape(DecodeString("/YdVzj+/89CYz/XCorkkZqbjbkSTj9/r9VPjxq3i3Lc="));

}

/* Code generated function */
function CreateListLeftHtml4()
{
    this.length = 7;

}





