document.addEventListener('DOMContentLoaded', function() {
	const controlButton = document.getElementById('controlButton');
	const iconControlButton = document.getElementById('iconControlButton');
	const sendButton = document.getElementById('sendButton');
	const recordedAudio = document.getElementById('recordedAudio');

	let mediaRecorder;
	let recordedChunks = [];
	let control = "empty";
	sendButton.disabled = true;
	ApiGet();

	// Gravar/encerrar/limpar a gravação de áudio 
	controlButton.addEventListener('click', function() {
		if (control == "empty") {
			startRecording();
		}
		else if (control == "recording") {
			stopRecording();
		} 
		else if (control == "hasAudio") {
			deleteAudio();
		}
		updateButtonsState();
	});


	// Enviar áudio para API
	sendButton.addEventListener('click', function() {
		// Adicione sua lógica para enviar o áudio para a API aqui
		// Por exemplo, use fetch() para enviar uma solicitação POST para a API com o áudio
		const recordedAudioUrl = recordedAudio.src;
		hideButtons();
	});

	function startRecording() {
		controlButton.classList.add('recording');
		iconControlButton.src = 'icones/stop.svg';
		navigator.mediaDevices.getUserMedia({ audio: true })
			.then(function(stream) {
				mediaRecorder = new MediaRecorder(stream);
				mediaRecorder.start();
				mediaRecorder.ondataavailable = function(e) {
					recordedChunks.push(e.data);
				};

				mediaRecorder.onstop = function() {
					const blob = new Blob(recordedChunks, { type: 'audio/mp4' });
					const url = URL.createObjectURL(blob);
					recordedAudio.src = url;
				};
			})
		setTimeout(stopRecording, 60000)
		
		control = "recording";
	}

	function stopRecording() {
		controlButton.classList.remove('recording');
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop();
			control = "hasAudio";
			iconControlButton.src = 'icones/trash.svg';
			updateButtonsState();
			recordedChunks = [];
		}
	}

	function deleteAudio() {
		recordedAudio.src = '';
		control = "empty";
		iconControlButton.src = 'icones/microphone.svg';
	}

	function updateButtonsState() {
		if (control === "hasAudio") {
			sendButton.disabled = false;
		} else {
			sendButton.disabled = true;
		}
	}

	function hideButtons() {
		sendButton.style.display = 'none';
		controlButton.style.display = 'none';
	}

	function hasAudio() {
		control === "hasAudio";
		iconControlButton.src = 'icones/trash.svg';
		sendButton.disabled = true;
	}
  
	function ApiGet() {
		audioURL = 'https://autolog.nacionaltransportes.com/anexos/6_audio_mql.ogg';
		if(audioURL !== ''){
			recordedAudio.src = audioURL;
			hasAudio();
		}
	}
});