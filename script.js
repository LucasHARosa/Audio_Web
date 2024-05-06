document.addEventListener('DOMContentLoaded', function() {
    const recordButton = document.getElementById('recordButton');
    const deleteButton = document.getElementById('deleteButton');
    const sendButton = document.getElementById('sendButton');
    const recordedAudio = document.getElementById('recordedAudio');
    let mediaRecorder;
    let recordedChunks = [];
  
    
  
    // Gravar ou encerrar gravação de áudio
    let isRecording = false;
    recordButton.addEventListener('click', function() {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    });

    // Apagar áudio
    deleteButton.addEventListener('click', function() {
        recordedAudio.src = '';
        console.log('Gravação apagada.');
    });

    // Enviar áudio para API
    sendButton.addEventListener('click', function() {
        // Adicione sua lógica para enviar o áudio para a API aqui
        // Por exemplo, use fetch() para enviar uma solicitação POST para a API com o áudio
        const recordedAudioUrl = recordedAudio.src;
        console.log('URL da gravação:', recordedAudioUrl);
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
        recordButton.classList.add('recording');
        isRecording = true;
    }
  
    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            console.log('Gravação encerrada.');
            recordButton.classList.remove('recording');
            isRecording = false;
            recordedChunks = [];
        }
    }
  
});