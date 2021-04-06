//DO NOT MODIFY ↓
define([
	'jquery'
], function ($) {
	//DO NOT MODIFY ↑

	// Global vars ---------------------------------------------
	//
	//		For variables that need to be saved across pages
	//
	// ---------------------------------------------------------
	var selectedAvatar = 0;
	// ---------------------------------------------------------
	
	
	
	function initialize() {
		setEvents();
	}

	function setEvents() {
		$(masterStructure)
			.on("Framework:systemReady", function () {
				systemReady();
			})
			.on("Framework:pageLoaded", function () {
				pageLoaded();
			});
		
		var $document = $(document).on("click vclick", ".btn-wb-lbx", function( event) {
			var $btn = $(this);
			
			$document.trigger( "open.wb-lbx", [
				[
					{
						src: $btn.data("target"),
						type: "inline"
					}
				]
			]);
		});
	}

	/* is called only once, when the Course has loaded*/
	function systemReady() {
		//console.log("Interactions:systemReady");
	}

	/* is called on every page load, great for adding custom code to all pages*/
	function pageLoaded() {
		//console.log("Interactions:pageLoaded");
		// ---------------------------------------------------------------------------------------------------------
		//
		//    Patch for SNAP making the previous button unreachable through tabbing
		//    Author: MeD
		//
		// ---------------------------------------------------------------------------------------------------------
		$(".backnext .back").attr("tabindex", 0);

		// ---------------------------------------------------------------------------------------------------------
		//
		//    Jump to top of page when page loaded
		//    Author: Unknown
		//
		// ---------------------------------------------------------------------------------------------------------
		
		window.scrollTo(0, 0);
		function scrollTos($obj, $animspeed)
		{	
			if($animspeed === undefined){
				$animspeed = 20;
			}
			$([document.documentElement, document.body]).animate({
				scrollTop: $obj.offset().top - 90
			}, $animspeed);
		}
		
		// ---------------------------------------------------------------------------------------------------------
		//
		//    Script to handle med-questionnaire forms - version 2.0
		//    Author: Vincent Timbro @ MeD
		//
		// ---------------------------------------------------------------------------------------------------------

		
		
		if ($(".med-questionnaire").length !== 0) {
			$(".med-questionnaire").each(function () {
				
				//new code for retry
				var the_questionnaire = $(this);
				var retryattempts = 0;
				if(the_questionnaire.hasClass("retry2"))
				{
					retryattempts = 2;
				}				
				
				var submit_button = the_questionnaire.find("button");
				var dropdowns = the_questionnaire.find("select");
				var inputs = the_questionnaire.find("input");
				var result = "unknown";
				var multi_question = the_questionnaire.find(".question");
				var onewaschecked = false;
				
				resetAssociationFeedback(the_questionnaire);

				//check to make sure all inputs are set to correct                                                               
				submit_button.click(function () {
					//reset
					resetAssociationFeedback(the_questionnaire);
					result = "unknown";

					if (multi_question.length !== 0) {
						multi_question.each(function (index) {
							inputs = multi_question.eq(index).find("input");
							onewaschecked = false;
							inputs.each(function (j) {
								if (inputs.eq(j).is(":checked")) {
									onewaschecked = true;
									result = adjustresult(inputs.eq(j), true, result, retryattempts);
								}
								{
									result = adjustresult(inputs.eq(index), false, result, retryattempts);
								}
							});

							if (onewaschecked === false && inputs.length > 0) {
								result = "unanswered";
							}

							dropdowns = multi_question.eq(index).find("select");
							dropdowns.each(function () {
								result = adjustresult($(this).find(":selected"), true, result, retryattempts);
							});
						});
					} else {
						onewaschecked = false;
						inputs.each(function (index) {
							if (inputs.eq(index).is(":checked")) {
								onewaschecked = true;
								result = adjustresult(inputs.eq(index), true, result, retryattempts);
							}
							else
							{
								result = adjustresult(inputs.eq(index), false, result, retryattempts);

							}
						});
						if (onewaschecked === false && inputs.length > 0) {
							result = "unanswered";
						}

						dropdowns.each(function () {
							result = adjustresult($(this).find(":selected"), true, result, retryattempts);
						});
					}

					//finalize answer
					if(result === "attempt1" || result === "attempt2")
					{
						if(retryattempts === 2){retryattempts = 1;}
						else if(retryattempts === 1){retryattempts = 0;}
					}
					
					displayAssocFeedback(the_questionnaire, result);

				});
			});

		}

		function adjustresult(obj, checked, currentresult, numretry) {
			
			if (currentresult === "unanswered") {
				return "unanswered";
			} else if (currentresult === "incorrect" || currentresult === "attempt1" || currentresult === "attempt2") 
			{
				if (obj.val() === undefined || obj.val() === "unanswered") 
				{
					return "unanswered";
				} 
				else if(numretry === 2)
				{
					return "attempt1";
				} else if(numretry === 1)
				{
					return "attempt2";
				} 
				else 
				{
					return "incorrect";	
				}//
					
			} 
			else if (currentresult === "correct" || currentresult === "unknown") 
			{
				if (obj.val() === undefined || obj.val() === "unanswered" || obj.val() === "unknown") 
				{
					return "unanswered";
				}
				
				
				else if (obj.val() !== "correct")
				{
					if(checked)
					{
						if(numretry === 2)
						{
							return "attempt1";
						} 
						else if(numretry === 1)
						{
							return "attempt2";
						}
						else 
						{
							return "incorrect";	
						}
					}
					else
					{
						return "correct";
					}
				} 
				else if(obj.val() === "correct")
				{
					if(checked)
					{
						return "correct";
					}
					else
					{
						if(numretry === 2)
						{
							return "attempt1";
						} 
						else if(numretry === 1)
						{
							return "attempt2";
						}
						else 
						{
							return "incorrect";	
						}
					}
						
				}
			}
			else
			{
				console.log("something went wrong");
				console.log("Value of current was: " + obj.val() + ", result was: " + currentresult + ",num retries was: " + numretry);
			}
		}

		//reset both feedback to invisible
		function resetAssociationFeedback(obj) {

			obj.find(".feedback").addClass("wb-inv");
		}

		//display appropriate feedback
		function displayAssocFeedback(exercise, feedvalue) {
			exercise.find(".feedback." + feedvalue).removeClass("wb-inv");
		}
		
		
		
		// -----------------------------------------------------------------------------------------------
		//
		//		Older questionnaire code, works with radio buttons and checkboxes by using OneAnswer or MultiAnswer
		//		Author: Various
		//
		// -----------------------------------------------------------------------------------------------
		
		if($(".MeD_OneAnswer_question").length !== 0 || $(".MeD_MultiAnswer_question").length !== 0) 
		{
			var oneAnswerQuestions = $(".MeD_OneAnswer_question");
			var multiAnswerQuestions = $(".MeD_MultiAnswer_question");
			
			oneAnswerQuestions.each(function (oneindex)
			{
				var selected;
				var selectedValue = "";
				
				$(this).find(".feedback").addClass("invisible");
				
				$(this).find("button").click(function ()
				{
					oneAnswerQuestions.eq(oneindex).find(".feedback").addClass("invisible");
					
					//check value of selected radio button 
		
					selected = oneAnswerQuestions.eq(oneindex).find("input:checked");
					selectedValue = selected.val();
					
					
					if(selectedValue === undefined)
					{
						oneAnswerQuestions.eq(oneindex).find(".nonechecked").removeClass("invisible");
						scrollTo(oneAnswerQuestions.eq(oneindex).find(".nonechecked"));
					}
					else
					{
						oneAnswerQuestions.eq(oneindex).find("." + selectedValue).removeClass("invisible");
						scrollTo(oneAnswerQuestions.eq(oneindex).find("." + selectedValue));
					}
					
				});
			});
			
			
			multiAnswerQuestions.each(function (multiindex)
			{
				var correct = true;
				var numberCorrect = 0;
				var numberCorrectChecked = 0;
				var nonechecked = true;	
				
				//count each that should be correct
				$(this).find("input").each(function ()
				{
					if($(this).val() === "correct")
					{
						numberCorrect += 1;
					}	
				});	
				
				
				$(this).find(".feedback").addClass("invisible");
				
				$(this).find("button").click(function ()
				{
					correct = true;
					numberCorrectChecked = 0;
					nonechecked = true;
					
					multiAnswerQuestions.eq(multiindex).find(".feedback").addClass("invisible");
					
					multiAnswerQuestions.eq(multiindex).find("input").each(function (){
						
						if($(this).val() === "incorrect" && $(this).prop("checked") === true)
						{
							correct = false;
							nonechecked = false;
						}
						
						if($(this).val() === "correct" && $(this).prop("checked") === true)
						{
							numberCorrectChecked += 1;
							nonechecked = false;
						}
												   
					});
					
					if(nonechecked)
					{
						multiAnswerQuestions.eq(multiindex).find(".nonechecked").removeClass("invisible");
						scrollTo(multiAnswerQuestions.eq(multiindex).find(".nonechecked")); 
					}
					else 
					{
						if(correct !== false)
						{
							if(numberCorrectChecked === numberCorrect)
							{
								//it was correct
								multiAnswerQuestions.eq(multiindex).find(".correct").removeClass("invisible");
								scrollTo(multiAnswerQuestions.eq(multiindex).find(".correct"));
							}
							else
							{
								//you did not select all of the correct ones
								multiAnswerQuestions.eq(multiindex).find(".incorrect").removeClass("invisible");
								scrollTo(multiAnswerQuestions.eq(multiindex).find(".incorrect"));
							}
						}
						else
						{
							//it was incorrect
							multiAnswerQuestions.eq(multiindex).find(".incorrect").removeClass("invisible");
							scrollTo(multiAnswerQuestions.eq(multiindex).find(".incorrect"));
						}
					}
					
					
				});
				
				
				
				
			});

		}
		
		
		// ---------------------------------------------------------------------------------------------------------
		//
		//		Scripts to simplify accessibility checking
		//		Author: Various
		//
		// ---------------------------------------------------------------------------------------------------------

		//--- make sur epage has only one h1 tag
		
		if($("h1").length > 1)
		{
			$("h1").each(function(index)
			{
				$("h1").eq(index).addClass("accessibility_error");
			});
			
			$("h1").eq(0).removeClass("accessibility_error");
		}
		
		
		// -----------------------------------------------------------------------------------------------
		//
		//                         Avatar Selector
		//
		// -----------------------------------------------------------------------------------------------

		if ($(".avatar_picker").length !== 0) {
			$(".avatar_picker").children("button").each(function (index) {
				$(this).click(function () {
					//alert("User selected Avatar # " + (index + 1));
					selectedAvatar = (index + 1);
				});
				
				refreshContestant();
			});
		}
		refreshContestant();

		function refreshContestant() {
			if ($(".avatar_full").length !== 0) {
				$(".avatar_full").attr("src", "content/medias/avatars/contestant" + selectedAvatar + "_full.png");
			}

			if ($(".avatar_full").length !== 0) {
				$(".avatar_full").attr("src", "content/medias/avatars/contestant" + selectedAvatar + "_portrait.png");
			}
		}

		// -------------------------------------------------------------------
		//
		//                        Scroll to accordion
		//
		// -------------------------------------------------------------------
		/*if ($("details").length !== 0) {
			$("details summary").click(function () {
				
				if($(this).attr("aria-expanded") === "false")
				{
					scrollTos($(this), 120);
				}
			});
		}*/
		
		// ---------------------------------------------------------------------------
		//
		//		Auto container - since container was removed from the index, 
		//		this adds a container if none are found on the page
		//
		// ---------------------------------------------------------------------------
		/*
		var $basechildren = $("#dynamic_content").children();
		$basechildren.each(function(){
			
			if($(this).hasClass("container") || $(this).hasClass("container-fluid"))
			{
				//content is in a container, no worries!
			}
			else
			{
				if($(this).is("style") || $(this).is("script"))
				{
					//ignore style tag
				}
				else
				{
					$(this).wrap("<section class='container'></section>");
				}
			}
			
		});*/
	}

	initialize();

});
