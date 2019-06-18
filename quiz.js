var position = 0;
var correct = 0;
var question, choice, options, optionA, optionB, optionC, optionD, randomisedQuestions;
var wrongQuestions = ["wrongTable"];
var yourAnswers = ["wrongTable"];
var correctAnswers = ["wrongTable"];
var correctQuestions = ["correctTable"];
var yourCorrectAnswers = ["correctTable"];
var pbar = document.getElementById("theBar");

var questions = [{
  question: "What does CSS stand for?",
  answers: ["Cascading style sheets", "Cascading CSS", "Cascading separate style", "None"]
}, {
  question: "Which attribute can set text to bold?",
  answers: ["Font weight", "Text-decoration", "Font style", "None"]
}, {
  question: "Which tag is used to link an external CSS file?",
  answers: ["Link", "Script", "Rel", "None"]
}, {
  question: "Which attribute sets the underline property?",
  answers: ["Text-decoration", "Font style", "Font weight", "None"]
}, {
  question: "Which measurement unit is NOT relative?",
  answers: ["Cm", "Px", "%", "Em"]
}, {
  question: "Which measurement unit IS relative?",
  answers: ["Em", "Cm", "MM", "Inch"]
}, {
  question: "What attribute is used to move an element’s content away from its border?",
  answers: ["Padding", "Margin", "Border", "Width"]
}, {
  question: "Which attribute does not contribute to a block elements total width?",
  answers: ["Background-image", "Width", "Border", "Padding"]
}, {
  question: "What property changes positioned elements display order?",
  answers: ["Z-index", "Width", "Background", "Azimuth"]
}, {
  question: "Which value of background-repeat will cause a background to repeat vertically?",
  answers: ["Repeat-y", "Repeat-x", "Repeat", "No-repeat"]
}];


// Function to shuffle array:
function shuffled(arr) {
  arr = arr.slice(); // make a copy
  for (var i = 0; i < arr.length; i++) {
    var j = Math.floor(Math.random() * (arr.length - i)) + i;
    [arr[i], arr[j]] = [arr[j], arr[i]]; // swap around
  }
  return arr;
}

// New randomised array
var randomisedQuestions = shuffled(questions);

// Function to display questions
function showQuestion() {

  $("#titleDiv").hide(); // Hide the start page
  $("#testDiv").show(); // Show the quiz page
  $(".startPos").removeClass("startPos"); // Remove the button class for start position
  // Reset fontawesome icon
  $(".mark").attr("class", "mark");

  // Reset form by clearing previous answers
  $(".choicesDiv").show(); // Show all divs for answer choices
  $("input[type=radio]").attr('disabled', false); // Re-enable radio buttons
  $(".radio").prop('checked', false); // Remove selected radiobutton
  $(".choicesDiv.selected").removeClass("selected"); // Remove colour bg for selected div
  $(".radiolabel.showCorrect").removeClass("showCorrect"); // Remove correct style class
  $(".radiolabel.showWrong").removeClass("showWrong"); // Remove wrong style class
  $(".choicesDiv.disableDiv").removeClass("disableDiv"); // Remove disabled div style class

  // Randomise the answer options
  var answers = shuffled(randomisedQuestions[position].answers);

  // Display question and option answers
  $(".questionNumber").html("Question " + (position + 1) + " of " + questions.length);
  question = randomisedQuestions[position].question;
  optionA = answers[0];
  optionB = answers[1];
  optionC = answers[2];
  optionD = answers[3];

  $(".quizQuestion").html(question);
  $("#A").html(optionA);
  $("#B").html(optionB);
  $("#C").html(optionC);
  $("#D").html(optionD);

  //Change button text and function
  $(".quizButton").html("Check Answer").attr("onclick", "checkAnswer()");

  // If the option is none, hide the div
  $(".radiolabel").each(function() {
    if ($(this).text() == "None") {
      $(this).parent().hide();
    }
  });

  // Make div clickable and select appropriate radiobutton
  $(".choicesDiv").click(function() {
    $(".choicesDiv.selected").removeClass("selected"); // Remove previously selected divs
    $(this).find("input[type=radio]").prop("checked", true); // Find the radio button within the clicked div
    $(this).addClass("selected"); // Add a background to selected div
  });

  // On hover, add class to divs
  $(".choicesDiv, .radio, .radiolabel").hover(function() {
    $(this).addClass("selectedHover");
  }, function() {
    $(this).removeClass("selectedHover");
  });
}
// End of showQuestion function


// Function to check if chosen answer is correct
function checkAnswer() {
  $(".selectAnswerTxt").hide(); // Take away 'Please choose answer' text if it's showing
  options = $(".radio"); // Declare options as

  // Check if an answer has been chosen
  if ($('input[name=options]:checked').length) {
    optionId = $('input[name=options]:checked').attr("id"); // Find id of checked radiobutton
    choice = $("label[for='" + optionId + "']").text(); // Find the value of the radiobutton
  } else { // No answer chosen
    $(".selectAnswerTxt").show(); // Show error message
    return;
  }

  // Find the right answer within the options and add style class and show tick
  $(".radiolabel").each(function() {
    if ($(this).text() == randomisedQuestions[position].answers[0]) {
      $(this).addClass("showCorrect");
      rightAnswer = $(this).attr("id");
      $("#mark" + rightAnswer).addClass("fas fa-check fa-1x check");
    }
  });

  // If the choice is wrong, add showWrong class and show cross
  if (choice != randomisedQuestions[position].answers[0]) {
    $("label[for='" + optionId + "']").addClass("showWrong").parent().children(".mark").addClass("fas fa-times fa-1x times");
  }

  // If the choice is correct, add to score
  if (choice == randomisedQuestions[position].answers[0]) {
    correct++; // Add to score
    correctQuestions.push(randomisedQuestions[position].question); // Add the question to correctQuestions array
    yourCorrectAnswers.push(randomisedQuestions[position].answers[0]); // Add the correct answer to yourCorrectAnswers array
  } else {
    wrongQuestions.push(randomisedQuestions[position].question); // Add the question to wrongQuestions array
    yourAnswers.push(choice); // Add the wrong answer to yourAnswers array
    correctAnswers.push(randomisedQuestions[position].answers[0]); // Add the correct answer to correctAnswers array
  }

  // Next question
  position++;

  // Change progress bar
  pbar.style.width = position + "0%";
  pbar.innerHTML = position + "0 % Completed";

  // Change button text and function
  if (position <= 9) { // Questions 1-10, change button to below
    $(".quizButton").html("Next Question").attr("onclick", "showQuestion()");
  } else { // After question 10, change button to below
    $(".quizButton").html("Finish Quiz").attr("onclick", "showResults()").addClass("finishedQuiz");
  }

  disableChoices(); // Disable divs
}
// End of checkAnswer function


// Function to disable the divs after an answer has been selected
function disableChoices() {
  // Disable radio buttons
  $("input[type=radio]").attr('disabled', true);
  // Disable div selectability
  $(".choicesDiv").off("click");
  // Disable hover effect
  $(".choicesDiv, .radio, .radiolabel").unbind("mouseenter");
  // Add disableDiv style
  $(".choicesDiv").addClass("disableDiv");
}
// End of disableChoices function


//Results script
function showResults() {
  results(); // Function to populate the results table
  $(".correctTable tr:even").addClass("altRow"); // Change the background colour of alternating rows for Correct Table
  $(".wrongTable tr:even").addClass("altRow"); // Change the background colour of alternating rows for Wrong Table
  $("#testDiv").hide(); // Hide the test div
  $("#resultsDiv").show(); // Show the results div
  $(".score").html(correct); // Show the score

  // Display message depending on score
  if (correct == 0) { // If score is 0
    $(".message").html("You know nothing about CSS.");
    $(".icon").addClass("far fa-sad-cry fa-4x");
  } else if (correct > 0 && correct < 4) { // If score is 1-3
    $(".message").html("You need to review CSS again.");
    $(".icon").addClass("far fa-frown fa-4x");
  } else if (correct >= 4 && correct <= 6) { // If score is 4-6
    $(".message").html("You know a little, but a review would help");
    $(".icon").addClass("far fa-meh fa-4x");
  } else if (correct >= 7 && correct <= 9) { // If score is 7-9
    $(".message").html("Good job - but you could do better.");
    $(".icon").addClass("far fa-smile fa-4x");
  } else { // If score is 10
    $(".message").html("Well done! You are a CSS guru!");
    $(".icon").addClass("fas fa-star fa-4x");
  }

  // If there were no wrongly answered questions, hide the wrong table
  if (wrongQuestions.length == 1) {
    $(".reviewWrong").hide();
  }

  // If there were no wrongly answered questions, hide the wrong table
  if (correctQuestions.length == 1) {
    $(".reviewCorrect").hide();
  }
}
// End of showResults function

// Function to unhide results
function reviewResults() {
  $(".reviewResults").show(); // Show results div
  $(".reviewButton").html("Hide Results").attr("onclick", "hideResults()"); // Change button text and function
}
// End of reviewResults function

// Function to hide results
function hideResults() {
  $(".reviewResults").hide(); // Hide results div
  $(".reviewButton").html("View Results").attr("onclick", "reviewResults()"); // Change button text and function
}
// End of hideResults function

// Function to populate the results table
function results() {
  doneQuestions(wrongQuestions);
  doneQuestions(correctQuestions);
  doneAnswers(yourAnswers);
  doneAnswers(correctAnswers);
  doneAnswers(yourCorrectAnswers);
}
// End of results function

// Function to loop through the arrays of questions that the user has answered
function doneQuestions(name) {
  // Loop through length of array
  for (var i = 1; i < name.length; i++) {
    $("." + name[0]).append("<tr>"); // Find the right table and append a new row
    $("." + name[0] + " tr").last().append("<td>" + name[i] + "</td>"); // Find the last row added and append a new column with the array item
  }
}
// End of doneQuestions function

// Function to loop through the arrays of answers that the user has answered and correct answers
function doneAnswers(name) {
  // Loop through length of array
  for (var i = 1; i < name.length; i++) {
    var tableRows = $("." + name[0] + " tr"); // Declare
    $(tableRows[i]).append("<td>" + name[i] + "</td>"); // Find the right row and append a new column with the array item
  }
}
// End of doneAnswers function

// Refresh to try test again
$(".retryButton").click(function() {
  // Reset variables
  position = 0;
  correct = 0;
  wrongQuestions = ["wrongTable"];
  yourAnswers = ["wrongTable"];
  correctAnswers = ["wrongTable"];
  correctQuestions = ["correctTable"];
  yourCorrectAnswers = ["correctTable"];
  randomisedQuestions = shuffled(questions);

  $("#resultsDiv").hide(); // Hide the results div

  // Change progress bar back to 0
  pbar.style.width = "0%";
  pbar.innerHTML = "";

  // Remove all previous results from table - remove all except the first tr
  $(".wrongTable").find("tr:gt(0)").remove();
  $(".correctTable").find("tr:gt(0)").remove();

  // Show both tables, in case the previous user had all correct or all wrong answers
  $(".reviewWrong").show();
  $(".reviewCorrect").show();

  // Reset fontawesome icon
  $(".icon").attr("class", "icon");

  // Reset quizButton
  $(".quizButton").removeClass("finishedQuiz");

  // Hide results
  hideResults();

  // Start again
  showQuestion();
});


// If user tries to refresh mid-test, show alert
$(window).on('beforeunload', function() {

  // return "Are you sure you want to refresh?";
  if ($("#resultsDiv").is(":hidden")) {
    return "Are you sure you want to refresh?"; // default alert to ask if they want to refresh as their progress will not be saved
  }
});
