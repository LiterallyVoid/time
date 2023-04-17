const timer_svg = document.querySelector("#timer");
const svg_xmlns = "http://www.w3.org/2000/svg";

let target = new Date();

function updateText(id, text) {
	const el = document.getElementById(id);

	if (el.textContent == "" || el.textContent != text) el.textContent = text;
}

function updateTextAnimated(id, text) {
	const el = document.getElementById(id);

	if (el.textContent == "") {
		el.textContent = text;
		return;
	}

	if (el.textContent == text) {
		return;
	}

	el.textContent = text;

	el.style.animation = 'none';

	// https://stackoverflow.com/questions/6268508/restart-animation-in-css3-any-better-way-than-removing-the-element
	el.offsetHeight;

	el.style.animation = '1s fade';
}

function setEventName(name) {
	updateText("event-name", name);

	if (!name) {
		document.querySelector("#event").classList.add("hidden");
	} else {
		document.querySelector("#event").classList.remove("hidden");
	}
}

function updateTarget() {
	setEventName(null);

	if (location.hash) {
		const without_the_hash = location.hash.substr(1);

		if (without_the_hash.indexOf(";") !== -1) {
			const [date, name] = without_the_hash.split(";", 2);
			target = new Date(date);
			setEventName(decodeURIComponent(name));
		} else {
			target = new Date(without_the_hash);
		}
	}

	if (target.getDate() != target.getDate()) {
		target = new Date();
		location.hash = target.toISOString();
	}
}

updateTarget();

addEventListener("hashchange", (event) => {
	updateTarget();
});

function setTwoDigits(id_prefix, num) {
	const l = Math.floor(num / 10);
	const r = num % 10;

	updateTextAnimated(id_prefix + "l", l);
	updateTextAnimated(id_prefix + "r", r);
}

function setLong(id_prefix, num) {
	if (num === null) {
		document.getElementById(id_prefix + "-section").classList.add("hidden");
	} else {
		document.getElementById(id_prefix + "-section").classList.remove("hidden");
	}

	updateText(id_prefix + "-plural", num == 1 ? "" : "s");
	updateText(id_prefix, num);
}

function display() {
	const now = new Date().getTime();

	let sign_text = "+";
	let event_prefix = "after";

	let difference = (now - target.getTime());
	if (difference < 0) {
		difference = -difference;
		sign_text = "-";
		event_prefix = "before";
	}

	updateText("event-prefix", event_prefix);

	function takeRemainder(divisor) {
		const remainder = difference % divisor;

		difference = Math.floor(difference / divisor);

		return Math.floor(remainder);
	}

	const ms = takeRemainder(1000);

	const seconds = takeRemainder(60);

	const minutes = takeRemainder(60);
	const hours = takeRemainder(24);
	const days = takeRemainder(1/0);

	// I don't want to deal with months and years. Haha.
	const months = 0;
	const years = 0;

	updateText("prefix", "T" + sign_text);

	setLong("days", days > 0 || months > 0 || years > 0 ? days : null);
	setLong("months", months > 0 || years > 0 ? months : null);
	setLong("years", years > 0 ? years : null);

	setTwoDigits("h-", hours);
	setTwoDigits("m-", minutes);
	setTwoDigits("s-", seconds);
}

setInterval(display, 200);
display();

document.querySelector(".timer").classList.remove("hidden");
