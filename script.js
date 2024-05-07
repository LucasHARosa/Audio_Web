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
			iconControlButton.src = 'icones/stop.svg';
		}
		else if (control == "recording") {
			stopRecording();
			iconControlButton.src = 'icones/trash.svg';
		} 
		else if (control == "hasAudio") {
			deleteAudio();
			iconControlButton.src = 'icones/microphone.svg';
		}
		updateButtonsState();
	});


	// Enviar áudio para API
	sendButton.addEventListener('click', function() {
		// Adicione sua lógica para enviar o áudio para a API aqui
		// Por exemplo, use fetch() para enviar uma solicitação POST para a API com o áudio
		const recordedAudioUrl = recordedAudio.src;
		console.log('URL da gravação:', recordedAudioUrl);
		hideButtons();
	});

	function startRecording() {
		controlButton.classList.add('recording');
		navigator.mediaDevices.getUserMedia({ audio: true })
			.then(function(stream) {
				mediaRecorder = new MediaRecorder(stream);
				mediaRecorder.start();
				console.log('Gravação iniciada.');

				mediaRecorder.ondataavailable = function(e) {
					recordedChunks.push(e.data);
				};

				mediaRecorder.onstop = function() {
					const blob = new Blob(recordedChunks, { type: 'audio/mp4' });
					const url = URL.createObjectURL(blob);
					recordedAudio.src = url;
				};
			})
			.catch(function(err) {
				console.error('Erro ao acessar o dispositivo de áudio.', err);
			});
		setTimeout(stopRecording, 60000)
		
		control = "recording";
	}

	function stopRecording() {
		controlButton.classList.remove('recording');
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop();
			console.log('Gravação encerrada.');
			control = "hasAudio";
			recordedChunks = [];
		}
	}

	function deleteAudio() {
		recordedAudio.src = '';
		control = "empty";
		console.log('Gravação apagada.');
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
		hideButtons();
	}
  
	function ApiGet() {
		fetch('http://localhost:5000/api')
			.then(response => response.json())
			.then(data => {
				recordedAudio.src = data.url;
				hasAudio();
			})
			.catch(error => console.log('Erro:', error));
	}
});