
function playKeyboard() {

	let pressColor = '#1BC0EA'; //color when key is pressed


	var isMobile = !!navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);
	if (isMobile) { var evtListener = ['touchstart', 'touchend']; } else { var evtListener = ['mousedown', 'mouseup']; }

	var __audioSynth = new AudioSynth();
	__audioSynth.setVolume(0.5);
	var __octave = 4; //sets position of middle C, normally the 4th octave


	// Key bindings, notes to keyCodes.
	var keyboard = {

		/* 1 */
		49: 'J,-2',

		/* 2 */
		50: 'N,-2',

		/* 3 */
		51: 'C,-2',

		/* 4 */
		52: 'V,-2',

		/* 5 */
		53: 'P,-2',

		/* 6 */
		54: 'S,-2',

		/* 7 */
		55: 'B,-2',

		/* 8 */
		56: 'K,-2',

		/* 9 */
		57: 'T,-2',

		/* 0 */
		48: 'I,-2',

		/* Q */
		81: 'J,-1',

		/* W */
		87: 'N,-1',

		/* E */
		69: 'C,-1',

		/* R */
		82: 'V,-1',

		/* T */
		84: 'P,-1',

		/* Y */
		89: 'S,-1',

		/* U */
		85: 'B,-1',

		/* I */
		73: 'K,-1',

		/* O */
		79: 'T,-1',

		/* P */
		80: 'I,-1',

		/* A */
		65: 'J,0',

		/* S */
		83: 'N,0',

		/* D */
		68: 'C,0',

		/* F */
		70: 'V,0',

		/* G */
		71: 'P,0',

		/* H */
		72: 'S,0',

		/* J */
		74: 'B,0',

		/* K */
		75: 'K,0',

		/* L */
		76: 'T,0',

		/* ; */
		186: 'I,0',
	};

	// Keys you have pressed down.
	var keysPressed = [];

	// Create a reverse lookup table.
	var reverseLookup = {};

	for(const [key, value] of Object.entries(keyboard)) {
		reverseLookup[value] = key;
	};
	
	// Generate keyboard
	let visualKeyboard = document.getElementById('keyboard');
	let selectSound = {
		value: "1" //piano
	};

	var iKeys = 0;
	var iWhite = 0;
	var notes = __audioSynth._notes; //C, C#, D....A#, B

	for (var i = -2; i <= 0; i++) {
		for (var n in notes) {
			if (n[2] != 'b') {
				var thisKey = document.createElement('div');
				if (n == 'N' || n == 'V' || n=='S' || n=='T') { //arbitrarily chosen 
					thisKey.className = 'black key'; //2 classes
					thisKey.style.width = '30px';
					thisKey.style.height = '120px';
					thisKey.style.left = (40 * (iWhite - 1)) + 25 + 'px';
				} else {
					thisKey.className = 'white key';
					thisKey.style.width = '40px';
					thisKey.style.height = '200px';
					thisKey.style.left = 40 * iWhite + 'px';
					iWhite++;
				}

				var label = document.createElement('div');
				label.className = 'label';

				let s = getDispStr(n, i, reverseLookup);
				label.innerHTML = `<b class="keyLabel"> ${s} </b><br /><br /><img class="glyphsvg" alt="the alethi glyph representing ${n}" src=images/${n}.svg />`;
				thisKey.appendChild(label);
				thisKey.setAttribute('ID', `KEY_${n},${i}`);
				const keyCode = reverseLookup[`${n},${i}`];
				thisKey.addEventListener('mousedown', () => {
					fnPlayKeyboard({ keyCode });
				});
				visualKeyboard[`${n},${i}`] = thisKey;
				visualKeyboard.appendChild(thisKey);

				iKeys++;
			}
		}
	}

	visualKeyboard.style.width = iWhite * 40 + 'px';

	


	window.addEventListener(evtListener[1], function () { n = keysPressed.length; while (n--) { fnRemoveKeyBinding({ keyCode: keysPressed[n] }); } });

	// Detect keypresses, play notes.

	var fnPlayKeyboard = function ({keyCode}) {

		var i = keysPressed.length;
		while (i--) {
			if (keysPressed[i] == keyCode) {
				return false;
			}
		}
		keysPressed.push(keyCode);

		if (keyboard[keyCode]) {
			if (visualKeyboard[keyboard[keyCode]]) {
				visualKeyboard[keyboard[keyCode]].style.backgroundColor = pressColor;
				//visualKeyboard[keyboard[keyCode]].classList.add('playing'); //adding class only affects keypress and not mouse click
				visualKeyboard[keyboard[keyCode]].style.marginTop = '5px';
				visualKeyboard[keyboard[keyCode]].style.boxShadow = 'none';
			}
			var arrPlayNote = keyboard[keyCode].split(',');
			var note = arrPlayNote[0];
			var octaveModifier = arrPlayNote[1] | 0;
			fnPlayNote(note, __octave + octaveModifier);
		} else {
			return false;
		}

	}
	// Remove key bindings once note is done.
	var fnRemoveKeyBinding = function ({keyCode}) {

		var i = keysPressed.length;
		while (i--) {
			if (keysPressed[i] == keyCode) {
				if (visualKeyboard[keyboard[keyCode]]) {
					//visualKeyboard[keyboard[keyCode]].classList.remove('playing');
					visualKeyboard[keyboard[keyCode]].style.backgroundColor = '';
					visualKeyboard[keyboard[keyCode]].style.marginTop = '';
					visualKeyboard[keyboard[keyCode]].style.boxShadow = '';
				}
				keysPressed.splice(i, 1);
			}
		}

	}
	// Generates audio for pressed note and returns that to be played
	var fnPlayNote = function (note, octave) {

		src = __audioSynth.generate(selectSound.value, note, octave, 2);
		container = new Audio(src);
		container.addEventListener('ended', function () { container = null; });
		container.addEventListener('loadeddata', function (e) { e.target.play(); });
		container.autoplay = false;
		container.setAttribute('type', 'audio/wav');
		container.load();
		return container;

	};

	//returns correct string for display
	function getDispStr(n, i, lookup) {

		if (n == 'I' && i == 0) {
			return ";";
		} else {
			return String.fromCharCode(lookup[`${n},${i}`]);
		}

	}
	window.addEventListener('keydown', fnPlayKeyboard);
	window.addEventListener('keyup', fnRemoveKeyBinding);

	return fnPlayNote
}
