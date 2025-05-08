const foodWindow = document.getElementById('foodwindow')

console.log(foodWindow);


function moveWindow() {
    console.log('mouse entered')
}

foodWindow.addEventListener('mouseenter', moveWindow)


// function clockLocation() {
// console.log('clock dimension =', {
//     width: clockRect.width,
//     height: clockRect.height,
//     position: {
//         top:clockRect.top,
//         left: clockRect.left
//     }

// });
// }

// clockLocation()

let previousDeg = 0
let rotationCount = 0

function getMouseLocation(event) {

    const clockElement = document.querySelector('.clock')
    const clockRect = clockElement.getBoundingClientRect()

    const centerX = clockRect.left + clockRect.width / 2
    const centerY = clockRect.top + clockRect.height / 2

    // Same center point calculation...
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;

    // Shift to 12 o'clock
    // degrees = degrees + 90;
    let angle = Math.atan2(mouseY, mouseX);
    let degrees = (angle * (180 / Math.PI)) + 90;


    // Normalize the angle to be between 0 and 360 degrees
    // degrees = (degrees + 360) % 360;
    if (degrees < previousDeg) {
        rotationCount++
    }

    previousDeg = degrees

    return degrees
}

foodWindow.addEventListener('mousemove', function (event) {

    const degrees = getMouseLocation(event)

    foodWindow.style.transform = `rotate(${degrees}deg)`

})



foodWindow.addEventListener('click', function (event) {

    const degrees = getMouseLocation(event)

    let hour = degrees / 30
    hour = Math.round(hour * 2) / 2

    //getting hr and min digit here    

    let fullHour = Math.floor(hour);
    let minutes = (hour % 1) * 60;

    //time only starts with -6:00


    let isPM = rotationCount % 2 === 1
    let isAM = rotationCount % 2 === 0


    function timeFormatted() {

        let startHour = fullHour
        let endHour = fullHour + 8

        if (isPM) {
            startHour = startHour + 12
            endHour = endHour + 12
        }

        let startTime
        if (startHour < 0) {
            startHour = Math.abs(Math.abs(startHour) + (-12))
            startTime = `${startHour}:${minutes === 30 ? '30' : '00'}am`
        } else if (startHour > 12 && startHour <= 23) {
            startHour = startHour - 12
            startTime = `${startHour}:${minutes === 30 ? '30' : '00'}pm`
        } else {
            startTime = `${startHour}:${minutes === 30 ? '30' : '00'}am`
        }

        let endTime
        if (endHour >= 24) {
            endHour = endHour - 24
            endTime = `${endHour}:${minutes === 30 ? '30' : '00'}am`
        } else if (endHour > 12 && endHour <= 23) {
            endHour = endHour - 12
            endTime = `${endHour}:${minutes === 30 ? '30' : '00'}pm`
        } else {
            endTime = `${endHour}:${minutes === 30 ? '30' : '00'}pm`
        }

        return `${startTime} to ${endTime}`


    }



    let currentWinText = timeFormatted()

    console.log(`time window is : ${currentWinText}`);


    let greet = document.getElementById('window-greet')
    let description = document.getElementById('window-description')


    greet.innerHTML = greet.innerHTML.replace('...', '')
    greet.style.fontWeight = "400"
    description.innerHTML = `${currentWinText}`

})