const pictionary = function pictionary() {
  let context;
  const socket = io();
  let drawing;

  const draw = function draw({ x, y }) {
    context.beginPath();
    context.arc(x, y, 6, 0, 2 * Math.PI);
    context.fill();
  };

  const canvas = $('canvas');
  context = canvas[0].getContext('2d');
  canvas[0].width = canvas[0].offsetWidth;
  canvas[0].height = canvas[0].offsetHeight;
  canvas.on('mousemove', (event) => {
    if (!drawing) return;
    const offset = canvas.offset();
    const position = {
      x: event.pageX - offset.left,
      y: event.pageY - offset.top,
    };
    draw(position);
    socket.emit('draw', position);
  });

  canvas.on('mousedown', () => {
    drawing = true;
  });

  canvas.on('mouseup', () => {
    drawing = false;
  });

  socket.on('draw', (position) => {
    draw(position);
  });

  socket.on('guess', (guess) => {
    $('#receivedGuess').text(guess);
  });

  const guessBox = $('#guess input');
  const onKeyDown = (event) => {
    if (event.keyCode !== 13) { // Enter
      return;
    }

    socket.emit('guess', guessBox.val());
    guessBox.val('');
  };
  guessBox.on('keydown', onKeyDown);
};

$(document).ready(() => {
  pictionary();
});
