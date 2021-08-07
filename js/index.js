
var camera_ip = "192.168.100.88";
var base_url = "http://" + camera_ip + "/cgi-bin";
const user_info = {username: 'admin', password:'admin'}
// config defaults
var defaults = {
    ip: camera_ip,
    flip: 0,
    mirror: 0,
    invertcontrols: 0,
    panspeed: 8,
    zoomspeed: 5,
    tiltspeed: 8,
    focusspeed: 3,
};
var config = defaults;
config.ip = camera_ip;

function get_config () {
	var result = localStorage.getItem('configStorage1');
  if (!result) {
    return config;
  } else {
  	return JSON.parse(result);
  }
}

function save_config () {
	localStorage.setItem('configStorage1', JSON.stringify(config));
	console.log(config);
}

function run_action (action_url,params) {
	// $.get(url);
	$.ajax({
		url: action_url,
		type: 'POST',
		contentType: "application/json; charset=utf-8",
    	dataType: "json",
		data:JSON.stringify({
			key: parseInt(sessionStorage.getItem("login-key")),
			...params
		})
	})
	.done(function() {
		// console.log("success");
	})
	.fail(function(jqXHR, responseText, errorThrown) {
		// console.log("error");
	})
	.always(function() {
		// console.log("complete");
	});
}

// setup all the initial configuration and standard settings
function config_init () {

  config = get_config();
	console.log(config);

	// set the initial IP value for the camera ip input
	$("#cam_ip").val(config.ip);
	base_url = "http://" + config.ip + "/cgi-bin";

	// set the initial values for each select dropdown
	$("#panspeed").val(config.panspeed);
	$("#zoomspeed").val(config.zoomspeed);
	$("#tiltspeed").val(config.tiltspeed);
	$("#focusspeed").val(config.focusspeed);
	$("#autopaninterval").val(config.autopaninterval);

	// save_config();

	update_labels();
	login(user_info);
}

config_init();

function update_labels () {

	switch (config.flip) {
		case 0:
			$('#flip').html("Flip-No");
			break;
		case 1:
			$('#flip').html("Flip-Yes");
			break;
	}

	switch (config.mirror) {
		case 0:
			$('#mirror').html("Mirror-No");
			break;
		case 1:
			$('#mirror').html("Mirror-Yes");
			break;
	}

	switch (config.invertcontrols) {
		case 0:
			$('#invertcontrols').html("Invert Controls-No");
			break;
		case 1:
			$('#invertcontrols').html("Invert Controls-Yes");
			break;
	}

	config.ip = $('#cam_ip').val();
}

function reload_cam () {

	config.ip = $('#cam_ip').val();
	if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(config.ip)) {

		config.ip = config.ip;
		save_config();

		alert("New IP address saved.");
		login(user_info);
	} else {

		alert("IP address entered is invalid! Re-enter camera IP address.");
	}
}

function login({username, password}){
	$.ajax({
		url: base_url + '/web.fcgi?func=get',
		type: 'POST',
		data:JSON.stringify({
			key: null,
			system:{
				login: username + ':' + password
			}
		})
	})
	.done(function(data) {
		sessionStorage.setItem("login-key", data.system.login);
	})
	.fail(function(jqXHR, responseText, errorThrown) {
		// console.log("error");
	})
	.always(function() {
		// console.log("complete");
	});
}

function adjust_setting (action) {

	switch (action) {

		case 'flip':

			switch (config.flip) {
				case 0:
					config.flip = 1;
					save_config();
					update_labels();
					break;

				case 1:
					config.flip = 0;
					save_config();
					update_labels();
					break;
			}
			break;

		case 'mirror':
			switch (config.mirror) {
				case 0:
					config.mirror = 1;
					save_config();
					update_labels();
					break;

				case 1:
					config.mirror = 0;
					save_config();
					update_labels();
					break;
			}
			break;

		case 'invertcontrols':

			switch (config.invertcontrols) {
				case 0:
					config.invertcontrols = 1;
					save_config();
					update_labels();
					break;

				case 1:
					config.invertcontrols = 0;
					save_config();
					update_labels();
					break;
			}
			break;
	}
	update_settings();
}

// used for loading existing settings
function update_settings () {

	const loc = base_url + "/web.fcgi?func=set";
	let params = {
		image:{
		}
	}

	switch (config.flip) {

		case 0:
			params.image['flip'] = 0;
			break;

		case 1:
			params.image['flip'] = 1;
			break;
	}

	switch (config.mirror) {

		case 0:
			params.image['mirror'] = 0;
			break;

		case 1:
			params.image['mirror'] = 1;
			break;
	}
	run_action(loc,params);
	update_labels();
}

function cam_pantilt (camera, action) {
	const loc = base_url + "/web.fcgi?func=set";
	let params = {
		image:{
			ptz:[0,0]
		}
	}
	switch (action) {

		case 'left':

			if (config.invertcontrols == "1") {
				params.image.ptz[0] = 4;
				params.image.ptz[1] = config.panspeed;
			} else {
				params.image.ptz[0] = 3;
				params.image.ptz[1] = config.panspeed;
			}
			break;

		case 'right':

			if (config.invertcontrols == "1") {
				params.image.ptz[0] = 3;
				params.image.ptz[1] = config.panspeed;
			} else {
				params.image.ptz[0] = 4;
				params.image.ptz[1] = config.panspeed;
			}
			break;

		case 'up':

			if (config.invertcontrols == "1") {
				params.image.ptz[0] = 2;
				params.image.ptz[1] = config.tiltspeed;
			} else {
				params.image.ptz[0] = 1;
				params.image.ptz[1] = config.tiltspeed;
			}
			break;

		case 'down':

			if (config.invertcontrols == "1") {
				params.image.ptz[0] = 1;
				params.image.ptz[1] = config.tiltspeed;
			} else {
				params.image.ptz[0] = 2;
				params.image.ptz[1] = config.tiltspeed;
			}
			break;

		case 'home':
			params.image.ptz[0] = 5;
			params.image.ptz[1] = config.panspeed;
			break;

		case 'ptzstop':
			params.image.ptz[0] = 0;
			params.image.ptz[1] = config.panspeed;
			break;
	}

	run_action(loc,params);
}

function cam_zoom (camera, action) {
	const loc = base_url+ "/web.fcgi?func=set";
	let params = {
		image:{
			zoom:[0,0]
		}
	}
	if(action == 'zoomstop'){
		action = 0
	}
	params.image.zoom[0] = action;
	params.image.zoom[1] = config.zoomspeed;
	run_action(loc,params);
}

function cam_focus (camera, action) {
	const loc = base_url+ "/web.fcgi?func=set";
	let params = {
		image:{
			focus:[0,0]
		}
	}
	if(action == 'focusstop'){
		action = 0
	}
	params.image.focus[0] = action;
	params.image.focus[1] = config.zoomspeed;
	run_action(loc,params);
}

function cam_preset (camera, positionnum, action) {

	var loc = base_url + "/ptzctrl.cgi?ptzcmd&" + action + "&" + positionnum + "";
	run_action(loc);
}

function clear_active_preset () {
	$('.preset_image').removeClass("active");
}

/* ------------------------------------ Mouse Events & Clicks
 */

$('body').on('click', '.adjust_setting', function(e) {
	e.preventDefault();
	var action = $(this).data('action');
	adjust_setting(action);
	return false;
});

$('body').on('change', 'select.change_setting', function(e) {
	e.preventDefault();
	var action = $(this).attr('id');
	config[action] = parseInt($(this).val());
	save_config();
	return false;
});

$('body').on('click', '.call_preset', function(e) {
	e.preventDefault();
	var preset = $(this).data('preset');
	cam_preset(1, preset, 'poscall');
	clear_active_preset();
	$(this).addClass("active");
	return false;
});

$('body').on('click', '.assign_preset', function(e) {
	e.preventDefault();
	var preset = $(this).val();
	if (preset == 'Auto Pan Left Start Position') {
		preset = 11;
	}
	cam_preset(1, preset, 'posset');
	return false;
});

$('body').on('click', '.reload_cam', function(e) {
	e.preventDefault();
	reload_cam();
	return false;
});

$('body').on('mousedown', '.adjust_pantilt', function(e) {
	e.preventDefault();
	var action = $(this).data('action');
	cam_pantilt(1, action);
	clear_active_preset();
	return false;
});
$('body').on('mouseup', '.adjust_pantilt', function(e) {
	e.preventDefault();
	cam_pantilt(1, 'ptzstop');
	return false;
});

$('body').on('mousedown', '.adjust_zoom', function(e) {
	e.preventDefault();
	var action = $(this).data('action');
	cam_zoom(1, action);
	clear_active_preset();
	return false;
});
$('body').on('mouseup', '.adjust_zoom', function(e) {
	e.preventDefault();
	cam_zoom(1, 'zoomstop');
	return false;
});

$('body').on('mousedown', '.adjust_focus', function(e) {
	e.preventDefault();
	var action = $(this).data('action');
	cam_focus(1, action);
	clear_active_preset();
	return false;
});
$('body').on('mouseup', '.adjust_focus', function(e) {
	e.preventDefault();
	cam_focus(1, 'focusstop');
	return false;
});

// visual only toggle rocker buttons
$('body').on('mousedown', '.toggle-up', function(e) {
	e.preventDefault();
	$(this).parents('.rocker').addClass('rocker-up');
});
$('body').on('mouseup', '.toggle-up', function(e) {
	e.preventDefault();
	$(this).parents('.rocker').removeClass('rocker-up');
});

$('body').on('mousedown', '.toggle-down', function(e) {
	e.preventDefault();
	$(this).parents('.rocker').addClass('rocker-down');
});
$('body').on('mouseup', '.toggle-down', function(e) {
	e.preventDefault();
	$(this).parents('.rocker').removeClass('rocker-down');
});


/* ------------------------------------ Keyboard Events
 */

// UP
Mousetrap.bind('up', function(e) {
	if (e.repeat) return;
	cam_pantilt(1, 'up');
	$('.pantilt-up').addClass('active');
	return false;
}, 'keydown');

Mousetrap.bind('up', function(e) {
	cam_pantilt(1, 'ptzstop');
	$('.pantilt-up').removeClass('active');
	return false;
}, 'keyup');

// DOWN
Mousetrap.bind('down', function(e) {
	if (e.repeat) return;
	cam_pantilt(1, 'down');
	$('.pantilt-down').addClass('active');
	return false;
}, 'keydown');

Mousetrap.bind('down', function(e) {
	cam_pantilt(1, 'ptzstop');
	$('.pantilt-down').removeClass('active');
	return false;
}, 'keyup');

// LEFT
Mousetrap.bind('left', function(e) {
	if (e.repeat) return;
	cam_pantilt(1, 'left');
	$('.pantilt-left').addClass('active');
	return false;
}, 'keydown');

Mousetrap.bind('left', function(e) {
	cam_pantilt(1, 'ptzstop');
	$('.pantilt-left').removeClass('active');
	return false;
}, 'keyup');

// RIGHT
Mousetrap.bind('right', function(e) {
	if (e.repeat) return;
	cam_pantilt(1, 'right');
	$('.pantilt-right').addClass('active');
	return false;
}, 'keydown');

Mousetrap.bind('right', function(e) {
	cam_pantilt(1, 'ptzstop');
	$('.pantilt-right').removeClass('active');
	return false;
}, 'keyup');

/** NUMPAD Hot Key */

// UP
Mousetrap.bind('8', function(e) {
	if (e.repeat) return;
	cam_pantilt(1, 'up');
	$('.pantilt-up').addClass('active');
	return false;
}, 'keydown');

Mousetrap.bind('8', function(e) {
	cam_pantilt(1, 'ptzstop');
	$('.pantilt-up').removeClass('active');
	return false;
}, 'keyup');

// DOWN
Mousetrap.bind('2', function(e) {
	if (e.repeat) return;
	cam_pantilt(1, 'down');
	$('.pantilt-down').addClass('active');
	return false;
}, 'keydown');

Mousetrap.bind('2', function(e) {
	cam_pantilt(1, 'ptzstop');
	$('.pantilt-down').removeClass('active');
	return false;
}, 'keyup');

// LEFT
Mousetrap.bind('4', function(e) {
	if (e.repeat) return;
	cam_pantilt(1, 'left');
	$('.pantilt-left').addClass('active');
	return false;
}, 'keydown');

Mousetrap.bind('4', function(e) {
	cam_pantilt(1, 'ptzstop');
	$('.pantilt-left').removeClass('active');
	return false;
}, 'keyup');

// RIGHT
Mousetrap.bind('6', function(e) {
	if (e.repeat) return;
	cam_pantilt(1, 'right');
	$('.pantilt-right').addClass('active');
	return false;
}, 'keydown');

Mousetrap.bind('6', function(e) {
	cam_pantilt(1, 'ptzstop');
	$('.pantilt-right').removeClass('active');
	return false;
}, 'keyup');

// HOME
Mousetrap.bind('5', function(e) {
	if (e.repeat) return;
	cam_pantilt(1, 'home');
	$('.pantilt-home').addClass('active');
	return false;
}, 'keydown');

Mousetrap.bind('5', function(e) {
	cam_pantilt(1, 'ptzstop');
	$('.pantilt-home').removeClass('active');
	return false;
}, 'keyup');

// ZOOM IN
Mousetrap.bind('7', function(e) {
	if (e.repeat) return;
	cam_zoom(1, 2);
	$('.zoom_controls .rocker').addClass('rocker-down');
	return false;
}, 'keydown');

Mousetrap.bind('7', function(e) {
	cam_zoom(1, 'zoomstop');
	$('.zoom_controls .rocker').removeClass('rocker-down');
	return false;
}, 'keyup');

// ZOOM OUT
Mousetrap.bind('9', function(e) {
	if (e.repeat) return;
	cam_zoom(1, 1);
	$('.zoom_controls .rocker').addClass('rocker-up');
	return false;
}, 'keydown');

Mousetrap.bind('9', function(e) {
	cam_zoom(1, 'zoomstop');
	$('.zoom_controls .rocker').removeClass('rocker-up');
	return false;
}, 'keyup');