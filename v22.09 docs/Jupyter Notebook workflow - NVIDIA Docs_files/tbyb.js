var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

/**
 * Copyright 2022 NVIDIA Corporation. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// production deployment
// const BASE_URL = 'https://web.archive.org/web/20230329055507/https://tbyb.rivaspeech.com';
// local dev

(function rivaJs() {
    const DEFAULT_BASE_URL = 'https://web.archive.org/web/20230329055507/https://tbyb.rivaspeech.com';
    let BASE_URL = (window.rivaSettings && window.rivaSettings.baseUrl != null) ? window.rivaSettings.baseUrl : DEFAULT_BASE_URL;
    if(!BASE_URL) BASE_URL = window.location.href;

    // Dynamically load socket.io
    var socketio, socket, stream;
    var script = document.createElement('script');
    script.setAttribute('src', 'https://web.archive.org/web/20230329055507/https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.1.2/socket.io.min.js');
    script.setAttribute('integrity', 'sha384-toS6mmwu70G0fw54EGlWWeA4z3dyJ+dlXBtSURSKN4vyRFOcxd3Bzjj/AoOwY+Rg');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute("async", "false");
    let head = document.head;
    head.insertBefore(script, head.firstElementChild);

    var streamScript = document.createElement('script');
    streamScript.setAttribute('src', 'https://web.archive.org/web/20230329055507/https://cdnjs.cloudflare.com/ajax/libs/socket.io-stream/0.9.1/socket.io-stream.min.js');
    streamScript.setAttribute('integrity', 'sha512-LTN7WQKvmCiOWbwxE4XRu3NCRqLzkFo28vBDHVhAyKjhmorNGjtvFxQgbvAttO31Ij6An4AIXU4GVaYOC0eNpQ==');
    streamScript.setAttribute('crossorigin', 'anonymous');
    streamScript.setAttribute("async", "false");
    head.insertBefore(streamScript, head.firstElementChild);

    const id = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const maxAudioSeconds = 30;
    // const maxAudioSeconds = 5*60;
    const maxTTSChars = 400;
    const DEFAULT_LANG = 'en-US';
    const DEFAULT_VOICE = 'English-US-Female-1';
    var timerInterval;

    const transcribeBtn = '<span class="btn-label px-1"><i class="fa fa-microphone"></i></span> Transcribe';
    const stopBtn = '<span class="btn-label px-1"><i class="fa fa-stop"></i></span> Stop Demo';

    var localStream;
    var audio_context;
    var sampleRate;
    var rivaRunning = false;
    var muted = false;
    var currentLang;

    var audio;

    var finalTranscript = '';

    var AudioContext = window.AudioContext // Default
        || window.webkitAudioContext; // Safari and old versions of Chrome

    script.addEventListener("load", scriptLoaded, false);
    function scriptLoaded() {
        audio = document.getElementById('tts-output') || new Audio();
        var ttsField = document.getElementById('riva-tts-field');
        if (ttsField != undefined) {
            ttsField.setAttribute('maxlength', maxTTSChars);
        }

        populateLangSelect(true);
        populateVoiceSelect(true);


    }

    function connectSocket() {
        socketio = io(BASE_URL);

        socket = socketio.on('connect', function() {
            console.log('Socket connected to speech server');
        });

        socket.on('disconnect', function(reason) {
            console.log('Socket disconnected from speech server, reason:', reason);
        });

        // Transcription results streaming back from Riva
        socket.on('transcript', function(result) {
            if (result.transcript == undefined) {
                return;
            }
            showTranscript(result);
        });

        // Remote stop from server, typically from streaming timeout
        socket.on('stop', function() {
            if (rivaRunning) {
                stopRiva(false);
            }
        });

        // Update cookie when session is updated
        socket.on('cookie', function(serialized) {
            if (serialized) {
                document.cookie = serialized;
            }
        });
    }

    // ---------------------------------------------------------------------------------------
    // Start Riva for streaming ASR
    // ---------------------------------------------------------------------------------------
    function startRivaService(captchaToken) {
        if (rivaRunning) {
            return;
        }
        socket.emit('start', {sampleRate: sampleRate, lang: currentLang, captcha: captchaToken});

        // Start ASR streaming
        let audioInput = audio_context.createMediaStreamSource(localStream);

        // The stream-processor worklet node does the conversion from Float32 into 16-bit PCM
        audio_context.audioWorklet.addModule(new URL('/streamProcessor.js', BASE_URL))
            .then(function() {
                var streamWorkletNode = new AudioWorkletNode(audio_context, 'stream-processor', {
                    processorOptions: {
                        sampleRate: sampleRate
                    }
                });
                streamWorkletNode.port.onmessage = (event) => {
                    // Send transformed PCM buffer to the server
                    socket.emit('audio_in', event.data);
                };

                // connect stream to our worklet
                audioInput.connect(streamWorkletNode);
                // connect our worklet to the previous destination
                streamWorkletNode.connect(audio_context.destination);
            })
            .catch(ex => console.error(ex));

        rivaRunning = true;
    }

    // ---------------------------------------------------------------------------------------
    // Shows transcript as it comes in
    // ---------------------------------------------------------------------------------------
    function showTranscript(result) {
        if (result.is_final) {
            // append result to finalTranscript
            finalTranscript = finalTranscript + ' ' + result.transcript;
            document.getElementById("riva-transcription").innerText = finalTranscript;
        } else {
            document.getElementById("riva-transcription").innerText = finalTranscript + ' ' + result.transcript;
        }
        document.getElementById("riva-transcription").scrollTop = 100000;
    }

    /**
     * Starts the request of the microphone
     *
     * @param {Object} callbacks
     */
    function requestLocalAudio(callbacks) {
        // Request audio
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(callbacks.success)
        .catch(callbacks.error);
    }

    async function captchaWithRetry() {
        try {
            return await hcaptcha.execute({async: true});
        } catch(ex) {
            console.error(ex);
        }

        try {
            return await hcaptcha.execute({async: true});
        } catch (ex) {
            console.error(ex);
        }

        throw new Error('Captcha API failed');
    }

    function populateLangSelect() {
        var langSelect = document.getElementById('lang-select');
        if (langSelect == null) {
            currentLang = DEFAULT_LANG;
            return;
        }

        fetch(new URL("languages", BASE_URL))
        .then(response => response.json())
        .then(data => {
            var inner = "";
            data.forEach(function(item) {
                inner = inner + '<option value="' + item.code + '">' + item.desc + '</option>';
            });
            langSelect.innerHTML = inner;
            currentLang = langSelect.value;
        });
    }

    let langSelect = document.getElementById('lang-select');
    if (langSelect != null) {
        langSelect.onchange = function (e) {
            currentLang = this.value;
        }
    };

    function populateVoiceSelect() {
        var voiceSelect = document.getElementById('voice-select');
        if (voiceSelect == null) {
            currentVoice = DEFAULT_VOICE;
            return;
        }
        
        fetch(new URL("voices", BASE_URL))
        .then(response => response.json())
        .then(data => {
            var inner = "";
            data.forEach(function(item) {
                inner = inner + '<option value="' + item.voice + '">' + item.desc + '</option>';
            });
            voiceSelect.innerHTML = inner;
            currentVoice = voiceSelect.value;
        });
    }

    let voiceSelect = document.getElementById('voice-select');
    if (voiceSelect != null) {
        voiceSelect.onchange = function (e) {
            currentVoice = this.value;
        }
    };

    // ---------------------------------------------------------------------------------------
    // On clicking the Speak button, start Riva
    // ---------------------------------------------------------------------------------------
    const rivaSpeakBtnElem = document.getElementById('riva-speak-btn');
    if(rivaSpeakBtnElem != null) {
        rivaSpeakBtnElem.onclick = function (e) {
            if (!rivaRunning) {
                startRiva();
            } else {
                stopRiva();
            }
        };
    }


    function stopRiva(notifyServer=true) {
        stopTimer(document.getElementById("timer"));

        // clear the audio buffer before closing the Riva stream on server
        localStream.getTracks().forEach(track => track.stop());
        audio_context.close()
        .then(function () {
            if(notifyServer) {
                socket.emit('stop');
                socket.disconnect();
            }

            let btn = document.getElementById("riva-speak-btn");
            btn.innerHTML = transcribeBtn;
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');

            // document.getElementById("riva-speak-btn").innerHTML = transcribeBtn;
            rivaRunning = false;
        }); 
    }

    function startRiva() {
        finalTranscript = '';
        document.getElementById("riva-transcription").innerText = finalTranscript;
        document.getElementById("riva-transcription").setAttribute("style", "color: black");

        // run the captcha challenge before starting Riva
        captchaWithRetry()
        .then(function(captcha) {
            // socket.connect();
            connectSocket();

            requestLocalAudio({
                success: function(stream){
                    localStream = stream;
                    audio_context = new AudioContext();
                    sampleRate = audio_context.sampleRate;
                    startTimer(maxAudioSeconds, document.getElementById("timer"));
                    startRivaService(captcha.response);
                },
                error: function(err){
                    console.log("Cannot get access to your microphone.");
                    console.error(err);
                }
            });   
        
            let btn = document.getElementById("riva-speak-btn");
            btn.innerHTML = stopBtn;
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');

        })
        .catch(err => {
            console.error(err); // TODO: replace with visible error in transcribe window
        });
    }

    function setAudioEnabled(enabled) {
        if (!localStream) return;
        for (const track of localStream.getAudioTracks()) {
            track.enabled = enabled;
        }
    }

    function startTimer(duration, display) {
        var totalMinutes = (duration / 60) | 0;
        var totalSeconds = (duration % 60) | 0;
        var start = Date.now(),
            elapsed,
            minutes,
            seconds;

        totalMinutes = totalMinutes < 10 ? "0" + totalMinutes : totalMinutes;
        totalSeconds = totalSeconds < 10 ? "0" + totalSeconds : totalSeconds;

        function timer() {
            // get the number of seconds that have elapsed since 
            // startTimer() was called
            elapsed = (((Date.now() - start) / 1000) | 0);

            // does the same job as parseInt, truncates the float
            minutes = (elapsed / 60) | 0;
            seconds = (elapsed % 60) | 0;

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            // display.textContent = minutes + ":" + seconds + " / " + totalMinutes + ":" + totalSeconds; 
            display.innerHTML = minutes + ":" + seconds + " / " + totalMinutes + ":" + totalSeconds +
                "&nbsp; <span class='dot'></span>";
        };
        // we don't want to wait a full second before the timer starts
        timer();
        timerInterval = setInterval(timer, 1000);
    }

    function stopTimer(display) {
        clearInterval(timerInterval);
        display.textContent = '';
    }

    // ---------------------------------------------------------------------------------------
    // Audio file upload
    // ---------------------------------------------------------------------------------------
    var upload = document.querySelector('#riva-upload');
    var fileTypes = [
        "audio/wav"
    ];

    // upload.style.opacity = 0; // TODO: This is supposed to be more friendly to screen readers vs "hidden" but it's not properly hiding the "choose" part

    if (upload != undefined) {
        upload.addEventListener('change', sendAudioFile);
    }


    function computeAudioLength(file) {
        return new Promise(function(resolve) {
            var objectURL = URL.createObjectURL(file);
            var mySound = new Audio([objectURL]);
            mySound.addEventListener(
                "canplaythrough",
                () => {
                    URL.revokeObjectURL(objectURL);
                    resolve({
                        file,
                        duration: mySound.duration
                    });
                },
                false,
            );
        });  
    }

    function isAudioFileValid(file) {
        return new Promise(function(resolve) {
            if (!fileTypes.includes(file.type)) {
                showTranscript({
                    transcript: file.name + '\n Sorry, Riva currently supports only .wav input in this demo.\n',
                    is_final: true
                });
                resolve(false);
                return;
            }
            computeAudioLength(file)
            .then(function(result) {
                if (result.duration > maxAudioSeconds) {
                    showTranscript({
                        transcript: file.name + ': ' + result.duration + ' s\n'
                            + 'Sorry, this demo is limited to .wav files under 30 seconds.\n',
                        is_final: true
                    });
                    // TODO: if too long, clip the input to 30 seconds and then upload
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            })
        });
    }

    function sendAudioFile() {
        const curFiles = upload.files;
        var file, stream, blobStream, size;

        if (rivaRunning) {
            stopRiva();
        }

        finalTranscript = '';
        document.getElementById("riva-transcription").innerText = finalTranscript;

        if(curFiles.length === 0) {
            return;
        } else {
            // run the captcha challenge before sending to Riva
            captchaWithRetry()
            .then(async function(captcha) {
                file = curFiles[0];
                return({valid: await isAudioFileValid(file), captcha: captcha});
            }).then(function(result) {
                if (!result.valid) { return; } // TODO: Show friendly error msg in output box
                connectSocket();
                stream = ss.createStream();

                ss(socket).emit('batch_audio', stream, {name: file.name, lang: currentLang, captcha: result.captcha.response});

                blobStream = ss.createBlobReadStream(file);
                size = 0;

                // Show upload progress in the transcript window
                // TODO: reduce the UI update frequency? Might be artificially slowing the upload
                var lastProgress = 0;
                var progress;
                showTranscript({transcript: 'Uploading ' + file.name + ': ', is_final: true});
                blobStream.on('data', function(chunk) {
                    size += chunk.length;
                    progress = Math.floor(size / file.size * 100);
                    if (progress >= lastProgress + 5) {
                        showTranscript({transcript: progress + '%', is_final: false});
                        lastProgress = progress;
                    }
                });
                blobStream.on('end', function() {
                    showTranscript({transcript: 'Done\n-----\n', is_final: true});
                });

                blobStream.pipe(stream);
            }).catch(err => {
                console.error(err); // TODO: replace with visible error in transcribe window
            });
        
        }
    }

    // ---------------------------------------------------------------------------------------
    // TTS generate
    // ---------------------------------------------------------------------------------------
    var ttsInput = document.getElementById("riva-tts-form");
    function submitTTS(event) { 
        // Prevent reload of page after submitting of form
        event.preventDefault(); 
        let text = document.getElementById('riva-tts-field').value.trim();

        if (text.length == 0) {
            return;
        }

        // run the captcha challenge before sending to Riva
        captchaWithRetry()
        .then(function(captcha) {
            const ttsUrl = new URL('/tts', BASE_URL);
            ttsUrl.searchParams.set('voice', currentVoice);
            ttsUrl.searchParams.set('text', encodeURIComponent(text));
            ttsUrl.searchParams.set('token', captcha.response);
            audio.src = ttsUrl.toString();
        }).catch(err => {
            console.error(err); // TODO: replace with visible error in transcribe window
        });
    } 

    if (ttsInput != null) {
        ttsInput.addEventListener('submit', submitTTS);
    }

    function textInputHandler(event) {
        try {
            const { target } = event;

            const currentLength = target.value.length;
            ttsCharCountElem.innerText = currentLength;
        } catch(ex) {
            console.error(ex);
        }   
    }

    // Count chars in TTS textarea
    const ttsTextAreaElem = document.getElementById("riva-tts-field");
    const ttsCharCountElem = document.getElementById("tts-char-count");
    if(ttsTextAreaElem != null) {
        ttsTextAreaElem.addEventListener("input", textInputHandler);
    }


    // Programatically click on the right Text-to-Speech tab
    const sideBarTtsLinkElem = document.getElementById("side-bar-tts-link");
    if(sideBarTtsLinkElem != null) {
        sideBarTtsLinkElem.addEventListener("click", (event) => {
            document.getElementById("textToSpeech-tab").click();
        });
    }

    // Programatically click on the left ASR tab
    const sideBarAsrLinkElem = document.getElementById("side-bar-asr-link");
    if(sideBarAsrLinkElem != null) {
        sideBarAsrLinkElem.addEventListener("click", (event) => {
            document.getElementById("speechToText-tab").click();
        });
    }
    
})();



}
/*
     FILE ARCHIVED ON 05:55:07 Mar 29, 2023 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 15:03:21 Jun 22, 2023.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 314.79
  exclusion.robots: 0.083
  exclusion.robots.policy: 0.072
  cdx.remote: 0.059
  esindex: 0.009
  LoadShardBlock: 251.035 (3)
  PetaboxLoader3.datanode: 354.92 (5)
  load_resource: 324.896 (2)
  PetaboxLoader3.resolve: 128.745 (2)
*/