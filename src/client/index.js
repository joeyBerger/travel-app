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

let savedTrips = [];

const inputSection = document.getElementById('input-section')
// const inputForm = document.getElementById('input-form')
const findLocation = document.getElementById('find-location')
// const image = document.getElementById("destination-image");
const inputErrorMessages = document.getElementsByClassName("input-error");
const processingMessage = document.getElementById('processing');
const toggleButton = document.getElementById('toggle-button');

processingMessage.style.display = 'none'

let inputFields = {
    city : undefined,
    state : undefined,
    country : undefined,
}

Object.keys(inputFields).forEach(k => inputFields[k] = document.getElementById(k))

toggleButton.addEventListener('click', function(e) {
    const showing = inputSection.style.display !== 'none';
    inputSection.style.display = showing ? 'none' : 'block';
    e.srcElement.innerHTML = showing ? '+ Add Trip' : 'Hide Planner'
})

const handleUserInput = () => {
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

const createCustomElement = (tag,id,className,innerHTML,src,event) => {
    const element = document.createElement(tag);
    if (id) element.setAttribute("id", id);
    if (className) element.setAttribute("class", className);
    if (innerHTML) element.innerHTML = innerHTML;
    if (src) element.src = src
    // if (src) element.src = 'https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fblogs-images.forbes.com%2Flaurabegleybloom%2Ffiles%2F2018%2F06%2FCappadocia-by-%40izkiz-1200x801.jpg';

    if (event) element.addEventListener(event.type,event.action)
    
    return element;
}

findLocation.addEventListener('click', async e => {
    e.preventDefault();
    for (let i = 0; i < inputErrorMessages.length; i++) inputErrorMessages[i].style.display = 'none'
    const userInput = handleUserInput();
    if (!userInput) return;
    const {city,state,country,selectedDate} = userInput
    processingMessage.style.display = 'block'
    let res = await fetch(`searchPlace/${city}/${state}/${country}/${selectedDate}`)
    res = await res.json()
    console.log(res)
    processingMessage.style.display = 'none'
    if (res.error) {
        for (let i = 0; i < inputErrorMessages.length; i++) {
            if (inputErrorMessages[i].id.includes('server')) {
                inputErrorMessages[i].style.display = 'block'
                inputErrorMessages[i].style.innerHTML = res.error
            }
        }
    } else {
        inputSection.style.display = 'none'
        savedTrips.forEach(trip => trip.style.display = 'none')

        const tripId = savedTrips.length;
        const plannedTrips = document.getElementById('planned-trips');
        const container = createCustomElement('section',`trip-${tripId}`,'trip-section');
        toggleButton.style.display = 'none'

        let elements = [];
        elements.push(createCustomElement('h3',`trip-header-${tripId}`,undefined,`Planned Trip ${tripId+1}`));
        elements.push(createCustomElement('h5',undefined,'trip-header','Destination'));
        elements.push(createCustomElement('h3',undefined,'trip-data',`${city}${state!=='undefined'?`, ${state}`:''} - ${country}`));
        elements.push(createCustomElement('h5',undefined,'trip-header','Travel Date'));
        elements.push(createCustomElement('h3',undefined,'trip-data',selectedDate))
        elements.push(createCustomElement('h5',undefined,'trip-header','Low'));
        elements.push(createCustomElement('h3',undefined,'trip-data',`${res.lowTemp.celcius}° C / ${res.lowTemp.fahrenheit}° F`));
        elements.push(createCustomElement('h5',undefined,'trip-header','High'));
        elements.push(createCustomElement('h3',undefined,'trip-data',`${res.highTemp.celcius}° C / ${res.highTemp.fahrenheit}° F`));
        elements.push(createCustomElement('h5',undefined,'trip-header','Days Until Trip'));
        elements.push(createCustomElement('h3',undefined,'trip-data',res.daysBeforeTrip));

        // elements.push(createCustomElement('h4','travel-date',undefined,`Travel Date: ${selectedDate}`));

        elements.push(createCustomElement('div',undefined,'image-container',undefined,undefined));
        let image = createCustomElement('img','destination-image',undefined,undefined,res.webformatURL);
        elements[elements.length-1].appendChild(image)

        elements.push(createCustomElement('div',undefined,'button-container',undefined,undefined));

        let button = createCustomElement('button','save-button',undefined,'Save',undefined,{type : 'click', action : () => {       
            inputSection.style.display = 'block'
            toggleButton.style.display = 'block'
            savedTrips.forEach(trip => trip.style.display = 'block')
            document.getElementById('save-button').remove()
            document.getElementById(`cancel-button-${tripId}`).innerHTML = 'Remove Trip'
        }});
        elements[elements.length-1].appendChild(button)

        button = createCustomElement('button',`cancel-button-${tripId}`,undefined,'Cancel',undefined,{type : 'click', action : () => {
            inputSection.style.display = 'block'
            savedTrips.forEach(trip => trip.style.display = 'block')

            // savedTrips.slice(tripId).forEach((t,i) => {
            //     document.getElementById(`trip-header-${i}`).innerHTML = `Planned Trip ${i}`;
            //     console.log('i',i)
            // })

            container.remove();
            savedTrips = savedTrips.slice(tripId,tripId)

            console.log(savedTrips)

            if (savedTrips.length === 0) {
                toggleButton.style.display = 'block'
                toggleButton.innerHTML = 'Hide Planner'
            }
        }});
        elements[elements.length-1].appendChild(button)

        elements.forEach(e => container.appendChild(e))
        plannedTrips.appendChild(container)
        savedTrips.push(container)
    }    
})
