Prompts the user when they navigate away from the current page if they have applied any changes to a form

Usage
----------
To make all forms track "dirty state"

```javascript
 $("form") //select either a form or directly select input elements in a form to only track individual fields of a form
	.dirtyForm()
	.submit(function(){            
		$(this).markClean();//when submitting a form we need to mark it as clean so that the form can post away from the current page
            });
```

Disable "dirty" checks for individual elements (cancel buttons / links etc)

```javascript
$('a#cancel').skipDirtyForm();
```