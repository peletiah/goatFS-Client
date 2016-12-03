Action Creators
---------------

[bindActionCreator](http://redux.js.org/docs/api/bindActionCreators.html) takes 2 functions as arguments, one is an actionCreator from redux-form (e.g. "change") and the second is a dispatch-function, which then gets processed in RoutingReducer

e.g. we use the a [change-function](http://redux-form.com/6.2.1/docs/api/ActionCreators.md/) from redux-form (Which itself has formName, fieldName and fieldValue as arguments) and handlyModifiySequence as our dispatch-function:

```onChange = { value => { changeHandler('routingForm',input.name+'.command',value); handleModifySequence(index, value, input.value, 'command'); } }```

Selectors
---------

To be able to access to access the form-values, we use a [Selector](http://redux-form.com/6.2.1/docs/api/Selectors.md/). We need this to check if a specific value was choosen in one form-field that affects the input-type of another field, e.g. if we get a command like "bridge", we need to change the data-form-field to "MultiSelect"

To be able to access the field-values from within the Sequence-container, we use sequenceFormArray, which is set to the "sequences"-node of our state with 
```sequenceFormArray: selector(state, "sequences")```
