var timeForm = document.querySelector('.time-form');
var submitButton = document.querySelector('.time-form__button');
var firstPreset = document.querySelector('.presets__5');
var secondPreset = document.querySelector('.presets__10');
var thirdPreset = document.querySelector('.presets__15');
var closeModalBtn = document.querySelector('.modal__close');

var outputSeconds = document.querySelector('.display__output--seconds');
var outputMinutes = document.querySelector('.display__output--minutes');
var outputHours = document.querySelector('.display__output--hours');

var inputSeconds = document.querySelector('.time-form__input--seconds');
var inputMinutes = document.querySelector('.time-form__input--minutes');
var inputHours = document.querySelector('.time-form__input--hours');

var timer;
var audio;

firstPreset.addEventListener('click', function (evt) {
  hideControls();
  showNewTimer();
  startTimer('0', 5, '0');
  showProgress();
  showCheckbox();
});

secondPreset.addEventListener('click', function (evt) {
  hideControls();
  showNewTimer();
  startTimer(0, 10, 0);
  showProgress();
  showCheckbox();
});

thirdPreset.addEventListener('click', function (evt) {
  hideControls();
  showNewTimer();
  startTimer(0, 15, 0);
  showProgress();
  showCheckbox();
});

closeModalBtn.addEventListener('click', function (evt) {
  closeModal();
});

window.addEventListener('click', function (evt) {
  var modal = document.querySelector('.modal'); 
  if (evt.target == modal) {
    closeModal();
  };
});

submitButton.addEventListener('click', function (evt) {
  evt.preventDefault();

  if (ifEmpty() && (document.querySelector('.time-form__button').classList.contains('time-form__button--new-timer') == false)) {
    window.alert('Please, enter appropriate time');
  } else if (document.querySelector('.time-form__button').classList.contains('time-form__button--new-timer') == false) {
    hideControls();
    showNewTimer();
    startTimer();
    showProgress();
    showCheckbox();
  } else if (document.querySelector('.time-form__button').classList.contains('time-form__button--new-timer')) {
    stopTimer();
    hideProgress();
    hideCheckbox();
    returnDefaultStyles();
    clearFinishTime();
    showStart();
    showControls();
  }; 
});

function hideControls() {
  var presets = document.querySelector('.presets');
  var text = document.querySelector('.timer__text');
  var inputs = document.querySelector('.time-form__inputs');

  presets.style.display = 'none';
  text.style.display = 'none';
  inputs.style.display = 'none';
};

function showControls() {
  var presets = document.querySelector('.presets');
  var text = document.querySelector('.timer__text');
  var inputs = document.querySelector('.time-form__inputs');

  presets.style.display = 'flex';
  text.style.display = 'block';
  inputs.style.display = 'block'; 
};

function stopTimer() {
  clearInterval(timer);
  outputMinutes.innerHTML = '00';
  outputSeconds.innerHTML = '00';
  outputHours.innerHTML = '00';
};

function ifEmpty() {
  if (+inputHours.value == 0 && +inputMinutes.value == 0 && +inputSeconds.value == 0) {
    return true;
  };
  return false;
};

function showNewTimer() {
  var button = document.querySelector('.time-form__button');

  button.classList.add('time-form__button--new-timer');
  button.innerHTML = 'New t1m3R';
};

function showStart() {
  var button = document.querySelector('.time-form__button');

  button.classList.remove('time-form__button--new-timer');
  button.innerHTML = 'Start';
};

function ifSoundOn() {
  if (document.querySelector('#sound-check').checked) {
    return true;
  };
  return false;
};

function showCheckbox() {
  var checkbox = document.querySelector('.timer__sound');
  checkbox.style.display = 'block';
};

function hideCheckbox() {
  var checkbox = document.querySelector('.timer__sound');
  checkbox.style.display = 'none';
};

function showFinishTime(value) {
  var finish = document.querySelector('.timer__finish-time');
  var delta = value;
  var now = new Date(); 
  var time = new Date(now.getTime() + delta*1000);
  var hours = time.getHours().toString().length == 1 ? '0' + time.getHours() : time.getHours();
  var minutes = time.getMinutes().toString().length == 1 ? '0' + time.getMinutes() : time.getMinutes();

  finish.innerHTML = 'Your timer will end at ' + hours + ':' + minutes;
};

function clearFinishTime() {
  var finish = document.querySelector('.timer__finish-time');
  finish.innerHTML = '';
};

function returnDefaultStyles() {
  var progressBar = document.querySelector('.timer__progress-bar');
  var progressPercent = document.querySelector('.timer__progress-percent');

  progressPercent.style.right = '-45px';
  progressPercent.style.color = 'black';

  progressBar.style.width = '0%';
  progressPercent.innerHTML = '';
};

function showProgress() {
  var progress = document.querySelector('.timer__progress');
  progress.style.display = 'block';
};

function hideProgress() {
  var progress = document.querySelector('.timer__progress');
  progress.style.display = 'none';
};

function updateProgress(totalSeconds, secondsElapsed) {
  var progressBar = document.querySelector('.timer__progress-bar');
  var progressPercent = document.querySelector('.timer__progress-percent');
  var progress = Math.floor(100 / (totalSeconds / secondsElapsed));

  if (progress > 20) {
    progressPercent.style.right = '4px';
    progressPercent.style.color = 'white';
  };

  progressBar.style.width = progress + '%';
  progressPercent.innerHTML = progress + '%';
};

function openModal() {
  var modal = document.querySelector('.modal');  
  modal.style.display = 'block';
};

function closeModal() {
  var modal = document.querySelector('.modal');  
  modal.style.display = 'none';

  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  };
};

function startTimer(customHours, customMinutes, customSeconds) {
  if (customSeconds >= 0 && customMinutes >= 0 && customHours >= 0) {
    var userHours = +customHours;
    var userMinutes = +customMinutes;
    var userSeconds = +customSeconds;
  } else {
    var userHours = +inputHours.value;
    var userMinutes = +inputMinutes.value;
    var userSeconds = +inputSeconds.value;    
  };

  var totalSeconds = (userHours * 3600) + (userMinutes * 60) + userSeconds;
  var start = Date.now();

  showFinishTime(totalSeconds);

  timer = setInterval(function() {
    var delta = Date.now() - start;
    var secondsElapsed = Math.floor(delta/1000);
    var hoursLeft = Math.floor((totalSeconds - secondsElapsed)/3600);
    var minutesLeft = (-hoursLeft * 60) + Math.floor((totalSeconds - secondsElapsed)/60);
    var secondsLeft = (-hoursLeft * 3600) + (-minutesLeft * 60) + totalSeconds - secondsElapsed;
    
    if (hoursLeft < 0) {
      clearInterval(timer);
      openModal();

      if (ifSoundOn()) {
        audio = new Audio('../audio/kremlin_clock_ringing_01.mp3');
        audio.play();
      };
      return;
    };

    outputMinutes.innerHTML = (minutesLeft > 9) ? minutesLeft : '0' + minutesLeft;
    outputSeconds.innerHTML = (secondsLeft > 9) ? secondsLeft : '0' + secondsLeft;
    outputHours.innerHTML = (hoursLeft > 9) ? hoursLeft : '0' + hoursLeft;

    updateProgress(totalSeconds, secondsElapsed);
  }, 333);
};