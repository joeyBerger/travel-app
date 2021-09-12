const addToggleEventListener = (toggleButton,inputSection,toggleButtonLabels) => {
    toggleButton.addEventListener('click', function(e) {
        const showing = inputSection.style.display !== 'none';
        inputSection.style.display = showing ? 'none' : 'block';
        e.srcElement.innerHTML = showing ? toggleButtonLabels.show : toggleButtonLabels.hide
    })
}

export {addToggleEventListener}