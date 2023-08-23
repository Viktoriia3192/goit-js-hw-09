import Notiflix from 'notiflix';

const refs = {
  formField: document.querySelector(`form`),
  delayField: document.querySelector(`input[name="delay"]`),
  stepField: document.querySelector(`input[name="step"]`),
  amountField: document.querySelector(`input[name="amount"]`),
};

refs.formField.addEventListener(`submit`, onHandleForm);

let intervalId; // Зберігаємо ідентифікатор інтервалу

async function onHandleForm(event) {
  event.preventDefault();

  const delay = Number(refs.delayField.value);
  const step = Number(refs.stepField.value);
  const amount = Number(refs.amountField.value);

  let position = 0;

  if (amount <= 0 || delay < 0 || step < 0) {
    Notiflix.Notify.failure(`Please input correct values (>=0)`);
    return;
  }

  refs.formField.reset();

  let currentDelay = delay;

  intervalId = setInterval(async () => {
    position += 1;
    try {
      const result = await createPromise(position, currentDelay);
      Notiflix.Notify.success(
        `✅ Fulfilled promise ${result.position} in ${result.delay}ms`
      );
    } catch (error) {
      Notiflix.Notify.failure(
        `❌ Rejected promise ${error.position} in ${error.delay}ms`
      );
    }

    currentDelay += step;

    if (position >= amount) {
      clearInterval(intervalId); // Зупиняємо інтервал після створення всіх промісів
    }
  }, delay);
}


function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
