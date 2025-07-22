
const msg = new SpeechSynthesisUtterance();
let voices = [];
const voicesDropdown = document.querySelector('[name="voice"]');
const options = document.querySelectorAll('[type="range"], [name="text"]');
const speakButton = document.querySelector('#speak');
const stopButton = document.querySelector('#stop');

// Populate dropdown with voices
function populateVoices() {
  voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
   
    setTimeout(populateVoices, 100);
    return;
  }
  voicesDropdown.innerHTML = voices
    .map(
      voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`
    )
    .join('');
  // Set default voice if available
  const defaultVoice = voices.find(v => v.default) || voices[0];
  if (defaultVoice) {
    voicesDropdown.value = defaultVoice.name;
    msg.voice = defaultVoice;
  }
}


function setVoice() {
  const selectedVoice = voices.find(voice => voice.name === this.value);
  if (selectedVoice) {
    msg.voice = selectedVoice;
    // If speaking, restart with new voice
    if (window.speechSynthesis.speaking) {
      stopSpeech();
      speak();
    }
  }
}

// Speak function
function speak() {
  stopSpeech(); // Stop any current speaking
  msg.text = document.querySelector('[name="text"]').value;
  if (!msg.text.trim()) return; // Prevent speaking if no text
  window.speechSynthesis.speak(msg);
}

// Stop function (immediately halt speech)
function stopSpeech() {
  window.speechSynthesis.cancel();
}

// Set options for rate, pitch, and text
function setOption() {
  msg[this.name] = this.value;
  // If speech is ongoing, dynamically update by restarting (for rate/pitch changes)
  if ((this.name === 'rate' || this.name === 'pitch') && window.speechSynthesis.speaking) {
    speak();
  }
}

// Event listeners
window.speechSynthesis.onvoiceschanged = populateVoices;
voicesDropdown.addEventListener('change', setVoice);
options.forEach(option => option.addEventListener('change', setOption));
speakButton.addEventListener('click', speak);
stopButton.addEventListener('click', stopSpeech);

// On page load, populate voices ASAP
populateVoices();
