export default function swipeDetect(el, callback) {
  const touchsurface = el;
  let swipedir;
  let startX;
  let startY;
  let distX;
  let distY;
  const threshold = 50; // required min distance traveled to be considered swipe
  const restraint = 100; // maximum distance allowed at the same time in perpendicular direction
  const allowedTime = 2000; // maximum time allowed to travel that distance
  let elapsedTime;
  let startTime;
  const handleswipe = callback || (() => {});

  touchsurface.addEventListener('touchstart', (e) => {
    const touchobj = e.changedTouches[0];
    swipedir = 'none';
    distX = 0;
    startX = touchobj.pageX;
    startY = touchobj.pageY;
    startTime = new Date().getTime(); // record time when finger first makes contact with surface
  }, false);

  touchsurface.addEventListener('touchend', (e) => {
    const touchobj = e.changedTouches[0];
    distX = touchobj.pageX - startX;
    distY = touchobj.pageY - startY;
    elapsedTime = new Date().getTime() - startTime; // get time elapsed
    if (elapsedTime <= allowedTime) { // first condition for awipe met
      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
        swipedir = (distX < 0) ? 'left' : 'right';
      } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
        swipedir = (distY < 0) ? 'up' : 'down';
      }
    }
    handleswipe(swipedir);
  }, false);
}
