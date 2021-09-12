const getEssentialElements = () => {
    const returnObj = {}
    returnObj.inputSection = document.getElementById('input-section')
    returnObj.findLocation = document.getElementById('find-location')
    returnObj.inputErrorMessages = document.getElementsByClassName("input-error");
    returnObj.processingMessage = document.getElementById('processing');
    returnObj.toggleButton = document.getElementById('toggle-button');
    returnObj.plannedTrips = document.getElementById('planned-trips');
    return returnObj
}

const createCustomElement = (tag,id,className,innerHTML,src,event) => {
    const element = document.createElement(tag);
    if (id) element.setAttribute("id", id);
    if (className) element.setAttribute("class", className);
    if (innerHTML) element.innerHTML = innerHTML;
    if (src) element.src = src;
    if (event) element.addEventListener(event.type,event.action);    
    return element;
}

export {getEssentialElements,createCustomElement}