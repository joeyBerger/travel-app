import { checkForName } from './js/nameChecker'
import { handleSubmit } from './js/formHandler'


import datepicker from 'js-datepicker'

import './styles/resets.scss'
import './styles/base.scss'
import './styles/form.scss'
import './styles/section.scss'
import './styles/datepicker.min.scss'
import './styles/custom-styles.scss'

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
    },
    customDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
})
picker.calendarContainer.style.setProperty('font-size', '1.5rem')

console.log(picker)

picker.alwaysShow = true;
picker.show()

const savedTrips = [];

const inputForm = document.getElementById('input-form')
const findLocation = document.getElementById('find-location')
const image = document.getElementById("destination-image");
const inputErrorMessages = document.getElementsByClassName("input-error");

let inputFields = {
    city : undefined,
    state : undefined,
    country : undefined,
}

Object.keys(inputFields).forEach(k => inputFields[k] = document.getElementById(k))

// let width = document.body.clientHeight
// window.addEventListener('resize',() => {
//     console.log(document.body.clientWidth)
// })

const handleUserInput = () => {
    let checksPassed = true;
    let returnObject = {selectedDate}
    Object.keys(inputFields).forEach(k => {
        const {value} = inputFields[k];
        returnObject[k] = value;
        console.log(value)
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

const createCustomElement = (tag,id,className,innerHTML,src,event) => {
    const element = document.createElement(tag);
    if (id) element.setAttribute("id", id);
    if (className) element.setAttribute("class", className);
    if (innerHTML) element.innerHTML = innerHTML;
    if (src) {
        element.src = 'https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fblogs-images.forbes.com%2Flaurabegleybloom%2Ffiles%2F2018%2F06%2FCappadocia-by-%40izkiz-1200x801.jpg';
        console.log(src)
    }
    if (event) element.addEventListener(event.type,event.action)
    
    return element;
}

findLocation.addEventListener('click', async e => {
    e.preventDefault();
    for (let i = 0; i < inputErrorMessages.length; i++) inputErrorMessages[i].style.display = 'none'
    const userInput = handleUserInput();
    console.log(userInput)

    if (!userInput) return;
    const {city,state,country,selectedDate} = userInput
    let res = await fetch(`searchPlace/${city}/${state}/${country}/${selectedDate}`)
    res = await res.json()
    if (res.error) {

    } else {
        inputForm.style.display = 'none'
        // image.src = res.webformatURL;
        // const destination = document.getElementById('destination')
        // destination.innerHTML = `${city}${state!=='undefined'?`, ${state}`:''} ${country}`
        // const travelDate = document.getElementById('travel-date')
        // travelDate.innerHTML = `Days Until Trip: ${res.daysBeforeTrip}`;
        // const forecast = document.getElementById('forecast');
        // forecast.innerHTML = `Forecast: ${res.celcius}° / ${res.farenheight}°`;

        const tripId = savedTrips.length;
        const plannedTrips = document.getElementById('planned-trips');
        const container = createCustomElement('section',`trip-${tripId}`)

        savedTrips.forEach(trip => trip.style.display = 'none')

        let elements = [];
        elements.push(createCustomElement('h3','destination',undefined,`${city}${state!=='undefined'?`, ${state}`:''} ${country}`));
        elements.push(createCustomElement('h4','forecast',undefined,`Forecast: ${res.celcius}° C / ${res.farenheight}° F`));
        elements.push(createCustomElement('h4','travel-date',undefined,`Days Until Trip: ${res.daysBeforeTrip}`));
        // elements.push(createCustomElement('img','destination-image',undefined,undefined,res.webformatURL));

        elements.push(createCustomElement('div',undefined,'image-container',undefined,undefined));
        let image = createCustomElement('img','destination-image',undefined,undefined,res.webformatURL);
        elements[elements.length-1].appendChild(image)


        // elements.push(createCustomElement('div',undefined,'image-container',undefined,undefined));
        // // let image = createCustomElement('img','destination-image',undefined,undefined,res.webformatURL);
        // let image = createCustomElement('div','destination-image',undefined,'TEST');
        // elements[elements.length-1].appendChild(image)


        elements.push(createCustomElement('div',undefined,'button-container',undefined,undefined));

        let button = createCustomElement('button','save-button',undefined,'Save',undefined,{type : 'click', action : () => {
            console.log('Save',tripId)            
            inputForm.style.display = 'block'
            savedTrips.forEach(trip => trip.style.display = 'block')
            document.getElementById('save-button').remove()
            document.getElementById(`cancel-button-${tripId}`).innerHTML = 'Remove Trip'            
        }});
        elements[elements.length-1].appendChild(button)

        button = createCustomElement('button',`cancel-button-${tripId}`,undefined,'Cancel',undefined,{type : 'click', action : () => {
            inputForm.style.display = 'block'
            container.remove();
            savedTrips.forEach(trip => trip.style.display = 'block')
            savedTrips.slice(tripId,tripId)
        }});
        elements[elements.length-1].appendChild(button)

        elements.forEach(e => container.appendChild(e))
        plannedTrips.appendChild(container)
        savedTrips.push(container)
    }
    console.log(res)
})
