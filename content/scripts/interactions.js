//DO NOT MODIFY ↓
define([
    'jquery'
], function($) {
//DO NOT MODIFY ↑

	// Global vars ------------------------------------------------------------------------------------------
	//		For variables that need to be saved across pages
	// ------------------------------------------------------------------------------------------------------
	var selectedAvatar = 0;
	

	
	// Initializing -----------------------------------------------------------------------------------------
	//		Initialize when system and page is ready
	// ------------------------------------------------------------------------------------------------------
	function initialize() {
		setEvents();
	}

	function setEvents() {
		$(masterStructure)
			.on("Framework:systemReady", function() {
				systemReady();
			})
			.on("Framework:pageLoaded", function() {
				pageLoaded();
			});
	}

	function systemReady() {
		//console.log("Interactions:systemReady");
	}

	// Interactions  ----------------------------------------------------------------------------------------
	//		is called on every page load, great for adding custom code to all pages
	// ------------------------------------------------------------------------------------------------------
	
	function pageLoaded() {
		
		
		
		//-----------------------------------------------------------------------------------------------------
		//    Jump to top of page when page loaded
		//    Author: Unknown
		//-----------------------------------------------------------------------------------------------------
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
		
		//-----------------------------------------------------------------------------------------------------
		//    MeD Questionnaire forms - version 2.0
		//    Author: Vincent Timbro @MeD
		//-----------------------------------------------------------------------------------------------------
		if ($(".med-questionnaire").length !== 0) {
			$(".med-questionnaire").each(function () {
				
				//retry - 2 attempts
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
					
					resetAssociationFeedback(the_questionnaire);
					result = "unknown";
					
					// For multi questions questionnaire ------------------------------------------------
					if (multi_question.length !== 0) {
						multi_question.each(function (index) {
							inputs = multi_question.eq(index).find("input");
							onewaschecked = false;
							
							// for Multiple Choice questions ----------------------------------------------
							inputs.each(function (j) {
								//check if any answer was submitted
								if (inputs.eq(j).is(":checked")) {
									onewaschecked = true;
									result = adjustresult(inputs.eq(j), true, result, retryattempts);
								}
								{
									result = adjustresult(inputs.eq(index), false, result, retryattempts);
								}
							});
							
							//no answer submitted
							if (onewaschecked === false && inputs.length > 0) {
								result = "unanswered";
							}
							// ----------------------------------------------------------------------------
							
							// for Dropdown questions -----------------------------------------------------
							dropdowns = multi_question.eq(index).find("select");
							dropdowns.each(function () {
								result = adjustresult($(this).find(":selected"), true, result, retryattempts);
							});
							// ----------------------------------------------------------------------------
						});
						
					// For one question  questionnaire -----------------------------------------------------
					} else {
						onewaschecked = false;
						
						// for Multiple Choice questions ---------------------------------------------------
						inputs.each(function (index) {
							//check if any answer was submitted
							if (inputs.eq(index).is(":checked")) {
								onewaschecked = true;
								result = adjustresult(inputs.eq(index), true, result, retryattempts);
							}
							else
							{
								result = adjustresult(inputs.eq(index), false, result, retryattempts);
							}
						});

						//no answer submitted
						if (onewaschecked === false && inputs.length > 0) {
							result = "unanswered";
						}
						// --------------------------------------------------------------------------------
							
						// for Dropdown questions ---------------------------------------------------------
						dropdowns.each(function () {
							result = adjustresult($(this).find(":selected"), true, result, retryattempts);
						});
						// --------------------------------------------------------------------------------
					}

					// Update attempt no -------------------------------------------------------------------
					if(result === "attempt1" || result === "attempt2")
					{
						if(retryattempts === 2){retryattempts = 1;}
						else if(retryattempts === 1){retryattempts = 0;}
					}
					
					displayAssocFeedback(the_questionnaire, result); // display appropriate feedback
				});
			});
		}

		//-----------------------------------------------------------------------------------------------------
		//    Function: Answer check w/ multiple attempts 
		//    Author: Vincent Timbro @MeD
		//-----------------------------------------------------------------------------------------------------
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
				}
					
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
			//Error log in console
			else
			{
				console.log("something went wrong");
				console.log("Value of current was: " + obj.val() + ", result was: " + currentresult + ",num retries was: " + numretry);
			}
		}
		
		//-----------------------------------------------------------------------------------------------------
		//    Function: Reset both feedback to invisible
		//    Author: Vincent Timbro @MeD
		//-----------------------------------------------------------------------------------------------------
		function resetAssociationFeedback(obj) {
			obj.find(".feedback").addClass("wb-inv");
		}


		//-----------------------------------------------------------------------------------------------------
		//    Function: Display appropriate feedback
		//    Author: Vincent Timbro @MeD
		//-----------------------------------------------------------------------------------------------------

		function displayAssocFeedback(exercise, feedvalue) {
			exercise.find(".feedback." + feedvalue).removeClass("wb-inv");
			$(document).trigger( "open.wb-lbx", [
				[
					{
						src: "#centred-popup1",
						type: "inline"
					}
				],
				true
			]);
		}
			
		//-----------------------------------------------------------------------------------------------------
		//    Scripts for accessbility checking
		//    Author: Various
		//-----------------------------------------------------------------------------------------------------
		
		// Check page to have only one h1 tag -----------------------------------------------------------------
		if($("h1").length > 1)
		{
			$("h1").each(function(index)
			{
				$("h1").eq(index).addClass("accessibility_error");
			});
			
			$("h1").eq(0).removeClass("accessibility_error");
		}
		
		//-----------------------------------------------------------------------------------------------------
		//    Avatar Selector
		//    Author: Unknown
		//-----------------------------------------------------------------------------------------------------
		
		if ($(".avatar_picker").length !== 0) {
			//To select avatar using the button elements in ".avatar_picker" div
			$(".avatar_picker").children("button").each(function (index) {
				$(this).click(function () {
					//alert("User selected Avatar # " + (index + 1));
					selectedAvatar = (index + 1);
				});
				
				refreshContestant(); //to refresh portraits in button elements
			});
		}
		refreshContestant(); //to refresh full size images
		
		//-----------------------------------------------------------------------------------------------------
		//    Function: Refresh contestants for avatars
		//    Author: Unknown
		//-----------------------------------------------------------------------------------------------------
		
		function refreshContestant() {
			if ($(".avatar_full").length !== 0) {
				$(".avatar_full").attr("src", "content/medias/avatars/contestant" + selectedAvatar + "_full.png");
			}

			if ($(".avatar_full").length !== 0) {
				$(".avatar_full").attr("src", "content/medias/avatars/contestant" + selectedAvatar + "_portrait.png");
			}
		}
		
		//-----------------------------------------------------------------------------------------------------
		//    Object Remover
		//    Author: MeD
		//-----------------------------------------------------------------------------------------------------
		
			//$("#wb-sm").remove();
			//$("#wb-sttl").parent().parent().remove();
			//$("#topbacknext").remove();
			loadFAQ();
		
		//-----------------------------------------------------------------------------------------------------
		//    Function: For FAQ favorites
		//    Author: Unknown
		//-----------------------------------------------------------------------------------------------------

		function loadFAQ() {
			var itemID;

			//list of learneable items
			for(var i=0;i<$(".learn-list>li").length;i++){
				itemID=$(".learn-list>li>.hint").eq(i).attr("id");
				$(".learn-list>li>.hint").eq(i).append("<a data-fav=\"#"+itemID+"\" class='favbtntest'>toggle favourite</a>");
			}	
			//this is the list of buttons for a predefined search
			for(i=0;i<$(".search-list>button").length;i++){
				$(".search-list>button").eq(i).click(function() {
					var searchText=($(this).text()==="*")?"":$(this).text();
					$(".wb-fltr-inpt").val(searchText)
					var e = jQuery.Event("keyup");
					//e.which = 50; // # Some key code value
					$(".wb-fltr-inpt").trigger(e);
					});
			}
		}	


			
			
	} //End of function pageload
	
	
	
	initialize(); //is called only once, when the Course has loaded
	
});
