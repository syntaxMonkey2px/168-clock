import { useState, useRef } from "react"

// 1. Angle tracking (mouse movement):
// Convert mouse position to degrees
// Calculate relative to clock center
// Control overlay rotation

// 2. AM/PM calculation:
// Track rotation count
// First 360° = AM
// Second 360° = PM
// Reset pattern

// 3. Time calculation:
// Convert degrees to hours (degrees/30)
// Round to nearest 30 mins
// Calculate 8-hour window
// Format time display

// 4. Click handling:
// Store selected time
// Update time display
// Show eating window//



const Clock = ({ setTimeWin, setShowWinDescription }) => {
    const clockElement = useRef(null)

    const [degree, setDegrees] = useState(0)
    const [rotationCount, setRotationCount] = useState(0)
    const [previousDeg, setPreviousDeg] = useState(0)
    const foodOverlayRef = useRef(null)



    const handleMouseEnter = () => {
        console.log('mouse entered')

        if (foodOverlayRef.current) {
            foodOverlayRef.current.style.animation = "none"
        }

    }

    // let previousDeg = 0
    // let rotationCount = 0

    const getMouseLocation = (event) => {

        const clockRect = clockElement.current.getBoundingClientRect()

        const centerX = clockRect.left + clockRect.width / 2
        const centerY = clockRect.top + clockRect.height / 2

        // Same center point calculation...
        const mouseX = event.clientX - centerX;
        const mouseY = event.clientY - centerY;

        // Shift to 12 o'clock
        // degrees = degrees + 90;
        let angle = Math.atan2(mouseY, mouseX);
        let newDegrees = (angle * (180 / Math.PI)) + 90;


        // Normalize the angle to be between 0 and 360 degrees
        // degrees = (degrees + 360) % 360;
        if (newDegrees < previousDeg) {
            setRotationCount(prev => prev + 1)
        }

        setDegrees(newDegrees)
        setPreviousDeg(newDegrees)

        return newDegrees
    }



    const handleMouseMove = (event) => {
        const degrees = getMouseLocation(event)
        if (foodOverlayRef.current) {
            foodOverlayRef.current.style.transform = `rotate(${degrees}deg)`
        }
    }

    const handleClick = (event) => {
        console.log("Clicked!")

        const degrees = getMouseLocation(event)

        let hour = degrees / 30
        hour = Math.round(hour * 2) / 2

        //getting hr and min digit here    

        let fullHour = Math.floor(hour);
        let minutes = (hour % 1) * 60;

        //time only starts with -6:00

        let startHour = fullHour
        let endHour = fullHour + 8

        // Determine AM/PM based on rotationCount
        let isPM = rotationCount % 2 === 1

        if (isPM) {
            startHour += 12
            endHour += 12
        }

        let startTime;
        if (startHour < 0) {
            startHour = Math.abs(Math.abs(startHour) + (-12))
            startTime = `${startHour}:${minutes === 30 ? '30' : '00'}am`
        } else if (startHour > 12 && startHour <= 23) {
            startHour = startHour - 12
            startTime = `${startHour}:${minutes === 30 ? '30' : '00'}pm`
        } else {
            startTime = `${startHour}:${minutes === 30 ? '30' : '00'}am`
        }

        let endTime;
        if (endHour >= 24) {
            endHour = endHour - 24
            endTime = `${endHour}:${minutes === 30 ? '30' : '00'}am`
        } else if (endHour > 12 && endHour <= 23) {
            endHour = endHour - 12
            endTime = `${endHour}:${minutes === 30 ? '30' : '00'}pm`
        } else {
            endTime = `${endHour}:${minutes === 30 ? '30' : '00'}pm`
        }
        setTimeWin({ start: startTime, end: endTime })
        setShowWinDescription(true)

    }

    return (
        <div className="clock" onMouseEnter={handleMouseEnter} ref={clockElement}>
            <img src="/clock-01.png" alt="" />
            <div className="clock-overlay"></div>
            <div className="foodwindow-overlay foodwindow"
                ref={foodOverlayRef}
                onMouseMove={handleMouseMove}
                onClick={handleClick}></div>
        </div>
    )
}
const Description = ({ timeWin, showWinDescription }) => {


    return (
        < div className="description-container" >
            <h1>16:8 Intermittent Fasting Visualizer</h1>
            <div className="window-text-container">
                <p className="window-greet">Enjoy your meals from...</p>
                {showWinDescription && (
                    <p className="window-description spin-instruction">
                        {timeWin.start && timeWin.end ? `${timeWin.start} to ${timeWin.end}` : "Spin and click the clock to set your window!"}
                    </p>
                )}
            </div>
        </div >
    )

}


function App() {
    //this is gonna pass in Clock so it has to be a level higher
    const [timeWin, setTimeWin] = useState({ start: null, end: null })
    const [showWinDescription, setShowWinDescription] = useState(false)


    return (
        <div className="app">
            <Description timeWin={timeWin} showWinDescription={showWinDescription} />
            <Clock setTimeWin={setTimeWin} setShowWinDescription={setShowWinDescription}/>
        </div>
    )

}

export default App