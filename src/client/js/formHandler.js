const handleUserInput = (inputFields,selectedDate,inputErrorMessages) => {
    let checksPassed = true;
    let returnObject = {selectedDate}
    Object.keys(inputFields).forEach(k => {
        const {value} = inputFields[k];
        returnObject[k] = value;
        if (k !== 'state' && !value) {
            checksPassed = false;
            for (let i = 0; i < inputErrorMessages.length; i++) {
                if (inputErrorMessages[i].id.includes(k)) inputErrorMessages[i].style.display = 'block'
            }
        }
        if (k === 'state' && returnObject[k] === '') returnObject[k] = 'undefined';
    })
    if (!selectedDate) {
        checksPassed = false;
        for (let i = 0; i < inputErrorMessages.length; i++) {
            if (inputErrorMessages[i].id.includes('calendar-error')) inputErrorMessages[i].style.display = 'block'
        }
    }
    return !checksPassed ? checksPassed : returnObject;
}

export { handleUserInput }
