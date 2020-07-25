# Enhanced Formik

todo: make a better readme. - Seriously, this is just thrown together for now.

TLDR, Formik is awesome, but it's also nice to have
'mini forms' that can handle their own validations
and submit handling independently of the page Formik.

// todo: update this documentation...
Enhanced Formik exposes 3 exports:

`FormContextWrapper` Component - Wrap your entire form with 
this and feed it children. It doesn't eat props, only children.

`EnhancedFormik` Component - Looks identical to normal `Formik`.
You shouldn't be able to tell the difference from the outside. Is there even a difference?
Use this instead of the vanilla `Formik`.

`useFormikSubmit` hook - Tie this into your _full_ form 
submit. Usually a button. Two buttons if you're frisky. (Don't do that, it's terrible UX)
Params:
* `onSubmit` - required function. Invoked on successful form validation/submit
* `onError` - optional function. Invoked when any form inside the `FormContextWrapper` has a validation error

ex:
```
const onSubmit = (formValues) => console.log(formValues)
const onError = (errorKeys) => console.log(errorKeys)
const submitHandler = useFormikSubmit({ onSubmit, onError })
```

If all else fails, look at the `src/stories/index.js` entry to see
how the public api of this thing works.
