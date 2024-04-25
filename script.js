document.addEventListener('DOMContentLoaded', function() {
  const playButton = document.getElementById('playButton');
  const chooseFileButton = document.getElementById('chooseFileButton');
  const recordButton = document.getElementById('recordButton');
  const audioPlayer = document.getElementById('audioPlayer');
  const storedPlayer = document.getElementById('storeAudio');
  const recordedAudio = document.getElementById('recordedAudio');
  let mediaRecorder;
  let recordedChunks = [];

  // Reproduzir áudio
  playButton.addEventListener('click', function() {
      audioPlayer.src = 'yeah-boy-114748.mp3'; // Substitua pelo caminho do seu áudio
      audioPlayer.play();
  });

  // Escolher áudio do computador
  chooseFileButton.addEventListener('click', function() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'audio/mp4, audio/mpeg, audio/ogg, audio/wav, video/mp4';
      input.onchange = function(e) {
          const file = e.target.files[0];
          const url = URL.createObjectURL(file);
          storedPlayer.src = url;
      };
      input.click();
  });

  // Gravar ou encerrar gravação de áudio
  let isRecording = false;
  recordButton.addEventListener('click', function() {
      if (!isRecording) {
          startRecording();
      } else {
          stopRecording();
      }
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

      recordButton.textContent = 'Parar Gravação';
      isRecording = true;
  }

  function stopRecording() {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
          console.log('Gravação encerrada.');
          recordButton.textContent = 'Gravar Áudio';
          isRecording = false;
          recordedChunks = [];
      }
  }

});