import { checkForName } from './js/nameChecker'
import { handleSubmit } from './js/formHandler'
import './styles/datepicker.min.scss'

import datepicker from 'js-datepicker'

// import './styles/resets.scss'
// import './styles/base.scss'
// import './styles/form.scss'
// import './styles/section.scss'


const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

const tomorrowObj = {
    dd : String(tomorrow.getDate()),
    mm : String(tomorrow.getMonth()),
    yyyy : tomorrow.getFullYear()
}

let selectedDate;

const picker = datepicker(document.querySelector('#calendar'), {
    minDate: new Date(tomorrowObj.yyyy, tomorrowObj.mm, tomorrowObj.dd),
    onSelect: (instance, date) => {
        if (date) {
            var tomorrowObj = new Date(date);
            var B = tomorrowObj.toISOString();
            selectedDate = B.split('T')[0];
        } else {selectedDate = ''}
      }
})

picker.alwaysShow = true;
picker.show()

const findLocation = document.getElementById('find-location')

const image = document.getElementById("destination-image");

let inputFields = {
    city : undefined,
    state : undefined,
    country : undefined,
}

Object.keys(inputFields).forEach(k => inputFields[k] = document.getElementById(k))


const handleUserInput = () => {
    let checksPassed = true;
    let returnObject = {selectedDate}
    Object.keys(inputFields).forEach(k => {
        const {value} = inputFields[k];
        returnObject[k] = value;
        if (k !== 'state' && !value) {
            checksPassed = false;
        }
        if (k === 'state' && returnObject[k] === '') returnObject[k] = 'undefined';
    })
    if (!selectedDate) checksPassed = false;
    return !checksPassed ? checksPassed : returnObject;
}


findLocation.addEventListener('click', async e => {
    e.preventDefault();
    const userInput = handleUserInput();
    if (!userInput) return;
    const {city,state,country,selectedDate} = userInput
    let res = await fetch(`searchPlace/${city}/${state}/${country}/${selectedDate}`)
    res = await res.json()
    if (res.error) {

    } else {
        image.src = res.webformatURL;
    }
    console.log(res)
})
