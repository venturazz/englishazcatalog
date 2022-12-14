//<![CDATA[

<!--


//MDH_SCORM modification to support SCORM 1.2 functionality on LMS
/* JavaScript to find the SCORM API if it is available */
/* Based on a model at <http://www.claroline.net/doc/en/index.php/How_do_I_create_SCORM_content%3F> */

var API = null; /* SCORM API */

/* look up through the frameset hierarchy for the SCORM API */
function findAPI(win)
{
	while ((win.API == null) && (win.parent != null) && (win.parent != win))
	{
		win = win.parent;
	}
	API = win.API;
}

/* initialize the SCORM API */
function initAPI(win)
{
	/* look for the SCORM API up in the frameset */
	findAPI(win);

	/* if we still have not found the API, look at the opener and its frameset */
	if ((API == null) && (win.opener != null))
	{
		findAPI(win.opener);
	}
}

var ScormSubmitted = false; //use this to check whether LMSFinish has been called later.

function ScormStartUp(){
	initAPI(window);
	if (API != null){
		API.LMSInitialize(''); 
		API.LMSSetValue('cmi.core.lesson_status', 'browsed');
		API.LMSSetValue('cmi.core.score.min', 0);
		API.LMSSetValue('cmi.core.score.max', 100);
		API.LMSCommit('');
	}
}

function CheckLMSFinish(){
	if (API != null){
		if (ScormSubmitted == false){
			API.LMSCommit('');
			API.LMSFinish('');
			ScormSubmitted = true;
		}
	}
}

function SetScormIncomplete(){
	if (ScormSubmitted == true){
		return;
	}
	SetScormScore();
	if (API != null){
		API.LMSSetValue('cmi.core.lesson_status', 'incomplete');
		API.LMSSetValue('cmi.core.session_time', MillisecondsToTime((new Date()).getTime() - ScormStartTime));
		API.LMSCommit('');
	}
}

function SetScormComplete(){
	if (API != null){
		API.LMSSetValue('cmi.core.session_time', MillisecondsToTime((new Date()).getTime() - ScormStartTime));
		API.LMSSetValue('cmi.core.lesson_status', 'completed');
		SetScormScore();
		API.LMSCommit('');
		API.LMSFinish('');
		ScormSubmitted = true;
	}
}

var ScormStartTime = (new Date()).getTime();

var SuspendData = '';

function SetScormTimedOut(){
	if (API != null){
		if (ScormSubmitted == false){
			SetScormScore();
			API.LMSSetValue('cmi.core.exit', 'time-out'); 
			API.LMSCommit('');
			CheckLMSFinish();
		}
	}
}

//TIME RENDERING FUNCTION
function MillisecondsToTime(Seconds){
	Seconds = Math.round(Seconds/1000);
	var S = Seconds % 60;
	Seconds -= S;
	if (S < 10){S = '0' + S;}
	var M = (Seconds / 60) % 60;
	if (M < 10){M = '0' + M;}
	var H = Math.floor(Seconds / 3600);
	if (H < 10){H = '0' + H;}
	return H + ':' + M + ':' + S;
}




//CODE FOR HANDLING NAV BUTTONS AND FUNCTION BUTTONS

function FocusAButton(){
	if (document.getElementById('CheckButton1') != null){
		document.getElementById('CheckButton1').focus();
	}
	else{
		if (document.getElementById('CheckButton2') != null){
			document.getElementById('CheckButton2').focus();
		}
		else{
			document.getElementsByTagName('button')[0].focus();
		}
	}
}




//CODE FOR HANDLING DISPLAY OF POPUP FEEDBACK BOX

var topZ = 1000;

function ShowMessage(Feedback){
	var Output = Feedback + '<br /><br />';
	document.getElementById('FeedbackContent').innerHTML = Output;
	var FDiv = document.getElementById('FeedbackDiv');
	topZ++;
	FDiv.style.zIndex = topZ;
	FDiv.style.top = TopSettingWithScrollOffset(30) + 'px';

	FDiv.style.display = 'block';

	ShowElements(false, 'input');
	ShowElements(false, 'select');
	ShowElements(false, 'object');
	ShowElements(true, 'object', 'FeedbackContent');

//Focus the OK button
	setTimeout("document.getElementById('FeedbackOKButton').focus()", 50);
	
//
}

function ShowElements(Show, TagName, ContainerToReverse){
// added third argument to allow objects in the feedback box to appear
//IE bug -- hide all the form elements that will show through the popup
//FF on Mac bug : doesn't redisplay objects whose visibility is set to visible
//unless the object's display property is changed

	//get container object (by Id passed in, or use document otherwise)
	TopNode = document.getElementById(ContainerToReverse);
	var Els;
	if (TopNode != null) {
		Els = TopNode.getElementsByTagName(TagName);
	} else {
		Els = document.getElementsByTagName(TagName);
	}

	for (var i=0; i<Els.length; i++){
		if (TagName == "object") {
			//manipulate object elements in all browsers
			if (Show == true){
				Els[i].style.visibility = 'visible';
			}
			else{
				Els[i].style.visibility = 'hidden';
			}
		} 
	}
}



function HideFeedback(){
	document.getElementById('FeedbackDiv').style.display = 'none';
	ShowElements(true, 'input');
	ShowElements(true, 'select');
	ShowElements(true, 'object');
}


//GENERAL UTILITY FUNCTIONS AND VARIABLES

//PAGE DIMENSION FUNCTIONS
function PageDim(){
//Get the page width and height
	this.W = 600;
	this.H = 400;
	this.W = document.getElementsByTagName('body')[0].offsetWidth;
	this.H = document.getElementsByTagName('body')[0].offsetHeight;
}

var pg = null;

function GetPageXY(El) {
	var XY = {x: 0, y: 0};
	while(El){
		XY.x += El.offsetLeft;
		XY.y += El.offsetTop;
		El = El.offsetParent;
	}
	return XY;
}

function GetScrollTop(){
	if (typeof(window.pageYOffset) == 'number'){
		return window.pageYOffset;
	}
	else{
		if ((document.body)&&(document.body.scrollTop)){
			return document.body.scrollTop;
		}
		else{
			if ((document.documentElement)&&(document.documentElement.scrollTop)){
				return document.documentElement.scrollTop;
			}
			else{
				return 0;
			}
		}
	}
}

function GetViewportHeight(){
	if (typeof window.innerHeight != 'undefined'){
		return window.innerHeight;
	}
	else{
		if (((typeof document.documentElement != 'undefined')&&(typeof document.documentElement.clientHeight !=
     'undefined'))&&(document.documentElement.clientHeight != 0)){
			return document.documentElement.clientHeight;
		}
		else{
			return document.getElementsByTagName('body')[0].clientHeight;
		}
	}
}

function TopSettingWithScrollOffset(TopPercent){
	var T = Math.floor(GetViewportHeight() * (TopPercent/100));
	return GetScrollTop() + T; 
}

//CODE FOR AVOIDING LOSS OF DATA WHEN BACKSPACE KEY INVOKES history.back()
var InTextBox = false;

function SuppressBackspace(e){ 
	if (InTextBox == true){return;}
	thisKey = e.keyCode;

	var Suppress = false;

	if (thisKey == 8) {
		Suppress = true;
		e.preventDefault();
	}
}

window.addEventListener('keypress',SuppressBackspace,false);

function ReduceItems(InArray, ReduceToSize){
	var ItemToDump=0;
	var j=0;
	while (InArray.length > ReduceToSize){
		ItemToDump = Math.floor(InArray.length*Math.random());
		InArray.splice(ItemToDump, 1);
	}
}

function Shuffle(InArray){
	var Num;
	var Temp = new Array();
	var Len = InArray.length;

	var j = Len;

	for (var i=0; i<Len; i++){
		Temp[i] = InArray[i];
	}

	for (i=0; i<Len; i++){
		Num = Math.floor(j  *  Math.random());
		InArray[i] = Temp[Num];

		for (var k=Num; k < (j-1); k++) {
			Temp[k] = Temp[k+1];
		}
		j--;
	}
	return InArray;
}

function WriteToInstructions(Feedback) {
	document.getElementById('InstructionsDiv').innerHTML = Feedback;

}




function EscapeDoubleQuotes(InString){
	return InString.replace(/"/g, '&quot;')
}

function TrimString(InString){
        var x = 0;

        if (InString.length != 0) {
                while ((InString.charAt(InString.length - 1) == '\u0020') || (InString.charAt(InString.length - 1) == '\u000A') || (InString.charAt(InString.length - 1) == '\u000D')){
                        InString = InString.substring(0, InString.length - 1)
                }

                while ((InString.charAt(0) == '\u0020') || (InString.charAt(0) == '\u000A') || (InString.charAt(0) == '\u000D')){
                        InString = InString.substring(1, InString.length)
                }

                while (InString.indexOf('  ') != -1) {
                        x = InString.indexOf('  ')
                        InString = InString.substring(0, x) + InString.substring(x+1, InString.length)
                 }

                return InString;
        }

        else {
                return '';
        }
}

function FindLongest(InArray){
	if (InArray.length < 1){return -1;}

	var Longest = 0;
	for (var i=1; i<InArray.length; i++){
		if (InArray[i].length > InArray[Longest].length){
			Longest = i;
		}
	}
	return Longest;
}

//SELECTION OBJECT FOR TYPING WITH KEYPAD
var selObj = null;
            
SelObj = function(box){
	this.box = box;
	this.selStart = this.box.selectionStart;
	this.selEnd = this.box.selectionEnd;
	this.selText = this.box.value.substring(this.selStart, this.selEnd);
	return this;
}

function setSelText(newText){
	var caretPos = this.selStart + newText.length;
	var newValue = this.box.value.substring(0, this.selStart);
	newValue += newText;
	newValue += this.box.value.substring(this.selEnd, this.box.value.length);
	this.box.value = newValue;
	this.box.setSelectionRange(caretPos, caretPos);
	this.box.focus();
}
SelObj.prototype.setSelText = setSelText;

function setSelSelectionRange(start, end){
	this.box.setSelectionRange(start, end);
}
SelObj.prototype.setSelSelectionRange = setSelSelectionRange;

//UNICODE CHARACTER FUNCTIONS
function IsCombiningDiacritic(CharNum){
	var Result = (((CharNum >= 0x0300)&&(CharNum <= 0x370))||((CharNum >= 0x20d0)&&(CharNum <= 0x20ff)));
	Result = Result || (((CharNum >= 0x3099)&&(CharNum <= 0x309a))||((CharNum >= 0xfe20)&&(CharNum <= 0xfe23)));
	return Result;
}

function IsCJK(CharNum){
	return ((CharNum >= 0x3000)&&(CharNum < 0xd800));
}

//SETUP FUNCTIONS
//BROWSER WILL REFILL TEXT BOXES FROM CACHE IF NOT PREVENTED
function ClearTextBoxes(){
	var NList = document.getElementsByTagName('input');
	for (var i=0; i<NList.length; i++){
		if ((NList[i].id.indexOf('Guess') > -1)||(NList[i].id.indexOf('Gap') > -1)){
			NList[i].value = '';
		}
		if (NList[i].id.indexOf('Chk') > -1){
			NList[i].checked = '';
		}
	}
}






//JCLOZE-SPECIFIC SCORM-RELATED JAVASCRIPT CODE

function SetScormScore(){
//Reports the current score and any other information back to the LMS
	if (API != null){
		API.LMSSetValue('cmi.core.score.raw', Score);
//Now send detailed reports about each item
		for (var i=0; i<State.length; i++){
			var ThisItemGuesses = '';
			var GapLabel = 'Gap_' + (i+1).toString();	
			var ThisItemScore = Math.floor(State[i].ItemScore * 100) + '';
			API.LMSSetValue('cmi.objectives.' + i + '.id', 'obj'+GapLabel);
			API.LMSSetValue('cmi.interactions.' + i + '.id', 'int'+GapLabel);
			API.LMSSetValue('cmi.objectives.' + i + '.score.raw', ThisItemScore);
			API.LMSSetValue('cmi.objectives.' + i + '.score.min', '0');
			API.LMSSetValue('cmi.objectives.' + i + '.score.max', '100');
			if (State[i].AnsweredCorrectly == true){
				API.LMSSetValue('cmi.objectives.' + i + '.status', 'completed');
			}
			else{
				API.LMSSetValue('cmi.objectives.' + i + '.status', 'incomplete');
			}
			for (var j=0; j<State[i].Guesses.length; j++){
				if (j>0){ThisItemGuesses += ' | ';}
				ThisItemGuesses += State[i].Guesses[j];	
			}	
			API.LMSSetValue('cmi.interactions.' + i + '.type', 'fill-in');
			API.LMSSetValue('cmi.interactions.' + i + '.student_response', ThisItemGuesses);
		}		
		API.LMSCommit('');
	}
}


//JCLOZE CORE JAVASCRIPT CODE

function ItemState(){
	this.ClueGiven = false;
	this.HintsAndChecks = 0;
	this.MatchedAnswerLength = 0;
	this.ItemScore = 0;
	this.AnsweredCorrectly = false;
	this.Guesses = new Array();
	return this;
}

var Feedback = '';
var Correct = 'Correct! Well done.';
var Incorrect = 'Some of your answers are incorrect. Incorrect answers have been left in place for you to change.'; 
var GiveHint = 'The next correct letter has been added to the answer.';
var CaseSensitive = false;
var YourScoreIs = 'Your score is ';
var Finished = false;
var Locked = false;
var Score = 0;
var CurrentWord = 0;
var Guesses = '';
var TimeOver = false;

I = new Array();

I[0] = new Array();
I[0][1] = new Array();
I[0][1][0] = new Array();
I[0][1][0][0] = '\u006E\u0061\u006D\u0065\u0064';
I[0][2]='';

I[1] = new Array();
I[1][1] = new Array();
I[1][1][0] = new Array();
I[1][1][0][0] = '\u0073\u0074\u0065\u0070';
I[1][2]='';

I[2] = new Array();
I[2][1] = new Array();
I[2][1][0] = new Array();
I[2][1][0][0] = '\u0062\u0061\u0064';
I[2][2]='';

I[3] = new Array();
I[3][1] = new Array();
I[3][1][0] = new Array();
I[3][1][0][0] = '\u006D\u0061\u0064\u0065';
I[3][2]='';

I[4] = new Array();
I[4][1] = new Array();
I[4][1][0] = new Array();
I[4][1][0][0] = '\u0061\u0073';
I[4][2]='';

I[5] = new Array();
I[5][1] = new Array();
I[5][1][0] = new Array();
I[5][1][0][0] = '\u0070\u0072\u0065\u0070\u0061\u0072\u0069\u006E\u0067';
I[5][2]='';

I[6] = new Array();
I[6][1] = new Array();
I[6][1][0] = new Array();
I[6][1][0][0] = '\u006F\u006E';
I[6][2]='';

I[7] = new Array();
I[7][1] = new Array();
I[7][1][0] = new Array();
I[7][1][0][0] = '\u0054\u0068\u0065\u0069\u0072';
I[7][2]='';

I[8] = new Array();
I[8][1] = new Array();
I[8][1][0] = new Array();
I[8][1][0][0] = '\u0064\u0061\u0079';
I[8][2]='';

I[9] = new Array();
I[9][1] = new Array();
I[9][1][0] = new Array();
I[9][1][0][0] = '\u0062\u0061\u006C\u006C';
I[9][2]='';

I[10] = new Array();
I[10][1] = new Array();
I[10][1][0] = new Array();
I[10][1][0][0] = '\u0074\u0068\u0065';
I[10][2]='';

I[11] = new Array();
I[11][1] = new Array();
I[11][1][0] = new Array();
I[11][1][0][0] = '\u006D\u0075\u0063\u0068';
I[11][2]='';

I[12] = new Array();
I[12][1] = new Array();
I[12][1][0] = new Array();
I[12][1][0][0] = '\u0074\u0068\u0065';
I[12][2]='';

I[13] = new Array();
I[13][1] = new Array();
I[13][1][0] = new Array();
I[13][1][0][0] = '\u0073\u0069\u0073\u0074\u0065\u0072\u0073';
I[13][2]='';

I[14] = new Array();
I[14][1] = new Array();
I[14][1][0] = new Array();
I[14][1][0][0] = '\u0068\u0061\u0064';
I[14][2]='';

I[15] = new Array();
I[15][1] = new Array();
I[15][1][0] = new Array();
I[15][1][0][0] = '\u006C\u006F\u006F\u006B\u0065\u0064';
I[15][2]='';

I[16] = new Array();
I[16][1] = new Array();
I[16][1][0] = new Array();
I[16][1][0][0] = '\u0062\u0065\u0063\u0061\u0075\u0073\u0065';
I[16][2]='';

I[17] = new Array();
I[17][1] = new Array();
I[17][1][0] = new Array();
I[17][1][0][0] = '\u0073\u0061\u0069\u0064';
I[17][2]='';

I[18] = new Array();
I[18][1] = new Array();
I[18][1][0] = new Array();
I[18][1][0][0] = '\u0068\u0061\u0072\u0064\u0077\u006F\u0072\u006B\u0069\u006E\u0067';
I[18][2]='';

I[19] = new Array();
I[19][1] = new Array();
I[19][1][0] = new Array();
I[19][1][0][0] = '\u0079\u006F\u0075';
I[19][2]='';

I[20] = new Array();
I[20][1] = new Array();
I[20][1][0] = new Array();
I[20][1][0][0] = '\u0063\u0068\u0061\u006E\u0067\u0065\u0064';
I[20][2]='';

I[21] = new Array();
I[21][1] = new Array();
I[21][1][0] = new Array();
I[21][1][0][0] = '\u0061';
I[21][2]='';

I[22] = new Array();
I[22][1] = new Array();
I[22][1][0] = new Array();
I[22][1][0][0] = '\u0064\u0072\u0065\u0073\u0073';
I[22][2]='';

I[23] = new Array();
I[23][1] = new Array();
I[23][1][0] = new Array();
I[23][1][0][0] = '\u0067\u006F\u0077\u006E';
I[23][2]='';

I[24] = new Array();
I[24][1] = new Array();
I[24][1][0] = new Array();
I[24][1][0][0] = '\u0073\u006C\u0069\u0070\u0070\u0065\u0072\u0073';
I[24][2]='';

I[25] = new Array();
I[25][1] = new Array();
I[25][1][0] = new Array();
I[25][1][0][0] = '\u0054\u0068\u0065\u006E';
I[25][2]='';

I[26] = new Array();
I[26][1] = new Array();
I[26][1][0] = new Array();
I[26][1][0][0] = '\u0068\u0061\u0076\u0069\u006E\u0067';
I[26][2]='';

I[27] = new Array();
I[27][1] = new Array();
I[27][1][0] = new Array();
I[27][1][0][0] = '\u0077\u0069\u0074\u0068';
I[27][2]='';

I[28] = new Array();
I[28][1] = new Array();
I[28][1][0] = new Array();
I[28][1][0][0] = '\u0074\u0077\u0065\u006C\u0076\u0065';
I[28][2]='';

I[29] = new Array();
I[29][1] = new Array();
I[29][1][0] = new Array();
I[29][1][0][0] = '\u0063\u006F\u0075\u006C\u0064';
I[29][2]='';

I[30] = new Array();
I[30][1] = new Array();
I[30][1][0] = new Array();
I[30][1][0][0] = '\u006C\u0065\u0066\u0074';
I[30][2]='';

I[31] = new Array();
I[31][1] = new Array();
I[31][1][0] = new Array();
I[31][1][0][0] = '\u0074\u0068\u0061\u0074';
I[31][2]='';

I[32] = new Array();
I[32][1] = new Array();
I[32][1][0] = new Array();
I[32][1][0][0] = '\u0067\u006C\u0061\u0073\u0073';
I[32][2]='';

I[33] = new Array();
I[33][1] = new Array();
I[33][1][0] = new Array();
I[33][1][0][0] = '\u0069\u0074';
I[33][2]='';

I[34] = new Array();
I[34][1] = new Array();
I[34][1][0] = new Array();
I[34][1][0][0] = '\u0074\u0068\u0065\u0079';
I[34][2]='';

I[35] = new Array();
I[35][1] = new Array();
I[35][1][0] = new Array();
I[35][1][0][0] = '\u006B\u0069\u006E\u0067';
I[35][2]='';

I[36] = new Array();
I[36][1] = new Array();
I[36][1][0] = new Array();
I[36][1][0][0] = '\u006F\u0075\u0074';
I[36][2]='';

I[37] = new Array();
I[37][1] = new Array();
I[37][1][0] = new Array();
I[37][1][0][0] = '\u0049\u0074';
I[37][2]='';

I[38] = new Array();
I[38][1] = new Array();
I[38][1][0] = new Array();
I[38][1][0][0] = '\u0054\u0068\u0065';
I[38][2]='';

I[39] = new Array();
I[39][1] = new Array();
I[39][1][0] = new Array();
I[39][1][0][0] = '\u0077\u0065\u0072\u0065';
I[39][2]='';


State = new Array();

function StartUp(){
//Show a keypad if there is one	(added bugfix for 6.0.4.12)
	if (document.getElementById('CharacterKeypad') != null){
		document.getElementById('CharacterKeypad').style.display = 'block';
	}
	

	ScormStartUp();






	var i = 0;

	State.length = 0;
	for (i=0; i<I.length; i++){
		State[i] = new ItemState();
	}
	
	ClearTextBoxes();
	

	StartTimer();


}

function ShowClue(ItemNum){
	if (Locked == true){return;}
	State[ItemNum].ClueGiven = true;
	ShowMessage(I[ItemNum][2]);
}

function SaveCurrentAnswers(){
	var Ans = '';
	for (var i=0; i<I.length; i++){
		Ans = GetGapValue(i);
		if ((Ans.length > 0)&&(Ans != State[i].Guesses[State[i].Guesses.length-1])){
			State[i].Guesses[State[i].Guesses.length] = Ans;
		}
	}
}

function CompileGuesses(){
	var F = document.getElementById('store');
	if (F != null){
		var Temp = '<?xml version="1.0"?><hpnetresult><fields>';
		var GapLabel = '';
		for (var i=0; i<State.length; i++){
			GapLabel = 'Gap ' + (i+1).toString();
			Temp += '<field><fieldname>' + GapLabel + '</fieldname>';
			Temp += '<fieldtype>student-responses</fieldtype><fieldlabel>' + GapLabel + '</fieldlabel>';
			Temp += '<fieldlabelid>JClozeStudentResponses</fieldlabelid><fielddata>';
			for (var j=0; j<State[i].Guesses.length; j++){
				if (j>0){Temp += '| ';}
				Temp += State[i].Guesses[j] + ' ';	
			}	
  		Temp += '</fielddata></field>';
		}
		Temp += '</fields></hpnetresult>';
		Detail = Temp;
	}
}

function CheckAnswers(){
	if (Locked == true){return;}
	SaveCurrentAnswers();
	var AllCorrect = true;

//Check each answer
	for (var i = 0; i<I.length; i++){

		if (State[i].AnsweredCorrectly == false){
//If it's right, calculate its score
			if (CheckAnswer(i, true) > -1){
				var TotalChars = GetGapValue(i).length;
				State[i].ItemScore = (TotalChars-State[i].HintsAndChecks)/TotalChars;
				if (State[i].ClueGiven == true){State[i].ItemScore /= 2;}
				if (State[i].ItemScore <0 ){State[i].ItemScore = 0;}
				State[i].AnsweredCorrectly = true;
//Drop the correct answer into the page, replacing the text box
				SetCorrectAnswer(i, GetGapValue(i));
			}
			else{
//Otherwise, increment the hints for this item, as a penalty
				State[i].HintsAndChecks++;

//then set the flag
				AllCorrect = false;
			}
		}
	}

//Calculate the total score
	var TotalScore = 0;
	for (i=0; i<State.length; i++){
		TotalScore += State[i].ItemScore;
	}
	TotalScore = Math.floor((TotalScore * 100)/I.length);
	document.getElementById('Score').value=TotalScore;

//Compile the output
	Output = '';

	if (AllCorrect == true){
		Output = Correct + '<br />';
	}

	Output += YourScoreIs + ' ' + TotalScore + '%.<br />';
	if (AllCorrect == false){
		Output += Incorrect;
	}
	ShowMessage(Output);
	setTimeout('WriteToInstructions(Output)', 50);
	
	Score = TotalScore;
	CompileGuesses();
	
	if ((AllCorrect == true)||(Finished == true)){
	


		window.clearInterval(Interval);

		TimeOver = true;
		Locked = true;
		Finished = true;
	}

	if (AllCorrect == true){
		SetScormComplete();
	}
	else{
		SetScormIncomplete();
	}

}

function TrackFocus(BoxNumber){
	CurrentWord = BoxNumber;
	InTextBox = true;
}

function LeaveGap(){
	InTextBox = false;
}

function CheckBeginning(Guess, Answer){
	var OutString = '';
	var i = 0;
	var UpperGuess = '';
	var UpperAnswer = '';

	if (CaseSensitive == false) {
		UpperGuess = Guess.toUpperCase();
		UpperAnswer = Answer.toUpperCase();
	}
	else {
		UpperGuess = Guess;
		UpperAnswer = Answer;
	}

	while (UpperGuess.charAt(i) == UpperAnswer.charAt(i)) {
		OutString += Guess.charAt(i);
		i++;
	}
	OutString += Answer.charAt(i);
	return OutString;
}

function GetGapValue(GNum){
	var RetVal = '';
	if ((GNum<0)||(GNum>=I.length)){return RetVal;}
	if (document.getElementById('Gap' + GNum) != null){
		RetVal = document.getElementById('Gap' + GNum).value;
		RetVal = TrimString(RetVal);
	}
	else{
		RetVal = State[GNum].Guesses[State[GNum].Guesses.length-1];
	}
	return RetVal;
}

function SetGapValue(GNum, Val){
	if ((GNum<0)||(GNum>=I.length)){return;}
	if (document.getElementById('Gap' + GNum) != null){
		document.getElementById('Gap' + GNum).value = Val;
		document.getElementById('Gap' + GNum).focus();
	}
}

function SetCorrectAnswer(GNum, Val){
	if ((GNum<0)||(GNum>=I.length)){return;}
	if (document.getElementById('GapSpan' + GNum) != null){
		document.getElementById('GapSpan' + GNum).innerHTML = Val;
	}
}

function FindCurrent() {
	var x = 0;
	FoundCurrent = -1;

//Test the current word:
//If its state is not set to already correct, check the word.
	if (State[CurrentWord].AnsweredCorrectly == false){
		if (CheckAnswer(CurrentWord, false) < 0){
			return CurrentWord;
		}
	}
	
	x=CurrentWord + 1;
	while (x<I.length){
		if (State[x].AnsweredCorrectly == false){
			if (CheckAnswer(x, false) < 0){
				return x;
			}
		}
	x++;	
	}

	x = 0;
	while (x<CurrentWord){
		if (State[x].AnsweredCorrectly == false){
			if (CheckAnswer(x, false) < 0){
				return x;
			}
		}
	x++;	
	}
	return FoundCurrent;
}

function CheckAnswer(GapNum, MarkAnswer){
	var Guess = GetGapValue(GapNum);
	var UpperGuess = '';
	var UpperAnswer = '';
	if (CaseSensitive == false){
		UpperGuess = Guess.toUpperCase();
	}
	else{
		UpperGuess = Guess;
	}
	var Match = -1;
	for (var i = 0; i<I[GapNum][1].length; i++){
		if (CaseSensitive == false){
			UpperAnswer = I[GapNum][1][i][0].toUpperCase();
		}
		else{
			UpperAnswer = I[GapNum][1][i][0];
		}
		if (TrimString(UpperGuess) == UpperAnswer){
			Match = i;
			if (MarkAnswer == true){
				State[GapNum].AnsweredCorrectly = true;
			}
		}
	}
	return Match;
}

function GetHint(GapNum){
	Guess = GetGapValue(GapNum);

	if (CheckAnswer(GapNum, false) > -1){return ''}
	RightBits = new Array();
	for (var i=0; i<I[GapNum][1].length; i++){
		RightBits[i] = CheckBeginning(Guess, I[GapNum][1][i][0]);
	}
	var RightOne = FindLongest(RightBits);
	var Result = I[GapNum][1][RightOne][0].substring(0,RightBits[RightOne].length);
//Add another char if the last one is a space
	if (Result.charAt(Result.length-1) == ' '){
		Result = I[GapNum][1][RightOne][0].substring(0,RightBits[RightOne].length+1);
	}
	return Result;
}

function ShowHint(){
	if (document.getElementById('FeedbackDiv').style.display == 'block'){return;}
	if (Locked == true){return;}
	var CurrGap = FindCurrent();
	if (CurrGap < 0){return;}

	var HintString = GetHint(CurrGap);

	if (HintString.length > 0){
		SetGapValue(CurrGap, HintString);
		State[CurrGap].HintsAndChecks += 1;
	}
	ShowMessage(GiveHint);
}

function TypeChars(Chars){
	var CurrGap = FindCurrent();
	if (CurrGap < 0){return;}
	var box = document.getElementById('Gap' + CurrGap);

	if (box != null){
		var selObj = SelObj(box);
		selObj.setSelText(Chars);
	}
}


function TimesUp() {
	document.getElementById('Timer').innerHTML = 'Your time is over!';

	TimeOver = true;
	Finished = true;
	CheckAnswers();
	Locked = true;

	SetScormTimedOut();

}






//CODE FOR HANDLING TIMER
//Timer code
var Seconds = 2700;
var Interval = null;

function StartTimer(){
	Interval = window.setInterval('DownTime()',1000);
	document.getElementById('TimerText').style.display = 'inline';
}

function DownTime(){
	var ss = Seconds % 60;
	if (ss<10){
		ss='0' + ss + '';
	}

	var mm = Math.floor(Seconds / 60);

	if (document.getElementById('Timer') == null){
		return;
	}

	document.getElementById('TimerText').innerHTML = mm + ':' + ss;
	if (Seconds < 1){
		window.clearInterval(Interval);
		TimeOver = true;
		TimesUp();
	}
	Seconds--;
}






//-->

//]]>
