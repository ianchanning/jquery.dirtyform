Prompts the user when they navigate away from the current page if they have applied any changes to a form

Usage
----------
To make all forms track "dirty state"

 $("form") //select eather a form or directly select input elements in a form to only track indervidual field of a form
	.dirtyForm()
	.submit(function(){            
		$(this).markClean();//when submitting a form we need to make it as clean so that for form can navigate away from the current page
            });
            
Disable "dirty" checks for indervidual elements (cancel buttons / links)

$('a#cancel').skipDirtyForm();