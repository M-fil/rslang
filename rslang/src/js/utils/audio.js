const playAudio = (source, audio) => {
  const { src, ended } = audio;

  if (src === '' || src !== source || ended) {
    audio.src = source;
    audio.play();
  }
};

export {
  playAudio,
};
