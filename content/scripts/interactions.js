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
		//    Author: Various @ MeD
		//-----------------------------------------------------------------------------------------------------
		if ($(".med-questionnaire").length !== 0) {
			
			//For each med-questionnaire on a page
			$(".med-questionnaire").each(function () {
				
				var the_questionnaire = $(this);	
				var submit_button = the_questionnaire.find(".btn-med");
				var dropdowns = the_questionnaire.find("select");
				var inputs = the_questionnaire.find("input");
				var result = "unknown";
				var onewaschecked = false;
				
				resetAssociationFeedback(the_questionnaire);

				//check to make sure all inputs are set to correct  
				submit_button.click(function () {
					
					resetAssociationFeedback(the_questionnaire);
					result = "unknown";
					onewaschecked = false;
						
					// for Multiple Choice questions ---------------------------------------------------
					inputs.each(function (index) {
						//check if any answer was submitted
						if (inputs.eq(index).is(":checked")) {
							onewaschecked = true;
							result = adjustresult(inputs.eq(index).val(), true, result);
						}
						else
						{
							result = adjustresult(inputs.eq(index).val(), false, result);
						}
					});

					//no answer submitted
					if (onewaschecked === false && inputs.length > 0) {
						result = "unanswered";
					}
								
					// for Dropdown questions ---------------------------------------------------------
					dropdowns.each(function () {
						result = adjustresult($(this).find(":selected").val(), true, result);
					});
					// --------------------------------------------------------------------------------
					
					displayAssocFeedback(the_questionnaire, result); // display appropriate feedback
				});
			});
		}

		//-----------------------------------------------------------------------------------------------------
		//    Function: Answer check w/ multiple attempts 
		//    Author: Various @ MeD
		//-----------------------------------------------------------------------------------------------------
		function adjustresult(value, selected, currentresult) {
				
			// Previous result indicated that the question was unanswered - this means the question has a portion with radio buttons or checkboxes and none of them were selected.
			
			var returnresult = "null"
			
			switch (currentresult){
					
				case "unanswered":
					returnresult = "unanswered"; break;
				case "incorrect":
					returnresult = "incorrect"; break;
				case "correct":
				case "unknown":
					
					if (value === undefined || value === "unanswered" || value === "unknown"){
						returnresult = "unanswered";
					}
					else if(value === "correct"){
						(selected) ? returnresult = "correct" : returnresult = "incorrect";
					}
					else if (value !== "correct"){
						(selected) ? returnresult = "incorrect" : returnresult = "correct";
					}
					break;
					
				default:
					console.log("something went wrong");
					console.log("Value of current was: " + value + ", result was: " + currentresult + ", return result was " + returnresult);
			}
			
			return returnresult;
		}
		
		//-----------------------------------------------------------------------------------------------------
		//    Function: Reset both feedback to invisible
		//    Author: Various @MeD
		//-----------------------------------------------------------------------------------------------------
		function resetAssociationFeedback(obj) {
			obj.find(".feedback").addClass("wb-inv");
		}


		//-----------------------------------------------------------------------------------------------------
		//    Function: Display appropriate feedback
		//    Author: Various @MeD
		//-----------------------------------------------------------------------------------------------------

		function displayAssocFeedback(exercise, feedvalue) {
			exercise.find(".feedback." + feedvalue).removeClass("wb-inv");
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
