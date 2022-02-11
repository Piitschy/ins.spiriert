

function show_cal() {
  document.getElementById("overlay").style.display = "block";
}
function hide_cal() {
  document.getElementById("overlay").style.display = "none";
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function check_cal() {
  await sleep(10);
  if (window.location.hash == "#cal_section") {
    show_cal();
  } else {
    hide_cal();
  }
}