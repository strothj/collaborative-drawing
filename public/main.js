const pictionary = function pictionary() {
  let context;

  const draw = function draw(position) {
    context.beginPath();
    context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
    context.fill();
  };

  const canvas = $('canvas'); // eslint-disable-line no-undef
  context = canvas[0].getContext('2d');
  canvas[0].width = canvas[0].offsetWidth;
  canvas[0].height = canvas[0].offsetHeight;
  canvas.on('mousemove', (event) => {
    const offset = canvas.offset();
    const position = {
      x: event.pageX - offset.left,
      y: event.pageY - offset.top,
    };
    draw(position);
  });
};

$(document).ready(() => { // eslint-disable-line no-undef
  pictionary();
});
