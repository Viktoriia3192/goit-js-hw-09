import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Report } from 'notiflix/build/notiflix-report-aio';


const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];

        if (selectedDate <= new Date()) {
            Notiflix.Notify.failure("Please choose a date in the future");
            document.querySelector('[data-start]').setAttribute('disabled', true);
        } else {
            document.querySelector('[data-start]').removeAttribute('disabled');
        }
    },
};

const dateTimePicker = flatpickr("#datetime-picker", options);
const startButton = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let countdownInterval;

startButton.addEventListener('click', () => {
    const selectedDate = dateTimePicker.selectedDates[0];

    if (!selectedDate) {
        Notiflix.Notify.failure("Please choose a valid date");
        return;
    }

    const targetTime = selectedDate.getTime();

    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeRemaining = targetTime - currentTime;

        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            updateTimer(0);
            Notiflix.Notify.success("Countdown completed!");
        } else {
            updateTimer(timeRemaining);
        }
    }, 1000);
});

function updateTimer(timeRemaining) {
    const time = convertMs(timeRemaining);
    daysValue.textContent = addLeadingZero(time.days);
    hoursValue.textContent = addLeadingZero(time.hours);
    minutesValue.textContent = addLeadingZero(time.minutes);
    secondsValue.textContent = addLeadingZero(time.seconds);
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor((ms % hour) / minute);
    const seconds = Math.floor((ms % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return value.toString().padStart(2, '0');
}
