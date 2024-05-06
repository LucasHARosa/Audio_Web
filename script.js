document.addEventListener('DOMContentLoaded', function() {
	const controlButton = document.getElementById('controlButton');
	const iconControlButton = document.getElementById('iconControlButton');
	const sendButton = document.getElementById('sendButton');
	const recordedAudio = document.getElementById('recordedAudio');

	let mediaRecorder;
	let recordedChunks = [];
	let control = "empty";
	
	sendButton.disabled = true;
	
	
	// Gravar/encerrar/limpar a gravação de áudio 
	controlButton.addEventListener('click', function() {
		if (control == "empty") {
			startRecording();
			iconControlButton.classList.remove('fa-microphone');
			iconControlButton.classList.add('fa-stop');
		}
		else if (control == "recording") {
			stopRecording();
			iconControlButton.classList.remove('fa-stop');
			iconControlButton.classList.add('fa-trash-alt');
		} 
		else if (control == "hasAudio") {
			deleteAudio();
			iconControlButton.classList.remove('fa-trash-alt');
			iconControlButton.classList.add('fa-microphone');
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
		
		control = "recording";
	}

	function stopRecording() {
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


	// Esconder os botões de enviar e controlar áudio
	function hideButtons() {
		sendButton.style.display = 'none';
		controlButton.style.display = 'none';
	}
  
});