const url = 'http://localhost:3000'
const client = require('socket.io-client')(url);
const blessed = require('blessed');
const prompt = require('prompt');
const spinner = require('ora')();
const util = require('util');

// client.on('connect', () => {
//     console.log('connected to server');
// });

// client.on('disconnect', () => {
//     client.emit('disconnect');
// });

(async () => {
    var schema = {
        properties: {
            username: {
                description: 'Enter your username',
                pattern: /^[a-zA-Z\s\-]+$/,
                message: 'Name must be only letters, spaces, or dashes',
                required: true
            },
            password: {
                description: 'Enter your password',
                replace: '*',
                hidden: true
            }
        }
    };

    // // Start the prompt
    // prompt.start();
    // prompt.message = '';

    // const get = util.promisify(prompt.get);
    // const result = await get(schema);
    // try {
    //     // Log the results.
    //     console.log('Command-line input received:');
    //     console.log('  name: ' + result.username);
    //     console.log('  password: ' + result.password);
    // } catch (e) {
    //     console.log(e)
    // }

    // Create a screen object.
    var screen = blessed.screen({
        smartCSR: true
    });

    screen.title = 'Terminal chat App';

    var form = blessed.form({
        parent: screen,
        keys: true,
        left: 'center',
        top: 'center',
        width: 30,
        height: 8,
        bg: 'green',
        autoNext: true,
        content: 'Add Alert'
    });

    var greaterThanEdit = blessed.Textbox({
        parent: form,
        top: 3,
        height: 1,
        left: 2,
        right: 2,
        bg: 'black',
        keys: true,
        inputOnFocus: true,
        content: 'test',
    });


    var submit = blessed.button({
        parent: form,
        mouse: true,
        keys: true,
        shrink: true,
        padding: {
            left: 1,
            right: 1
        },
        left: 10,
        bottom: 2,
        name: 'submit',
        content: 'submit',
        style: {
            bg: 'blue',
            focus: {
                bg: 'red'
            },
            hover: {
                bg: 'red'
            }
        }
    });

    var cancel = blessed.button({
        parent: form,
        mouse: true,
        keys: true,
        shrink: true,
        padding: {
            left: 1,
            right: 1
        },
        left: 20,
        bottom: 2,
        name: 'cancel',
        content: 'cancel',
        style: {
            bg: 'blue',
            focus: {
                bg: 'red'
            },
            hover: {
                bg: 'red'
            }
        }
    });

    submit.on('press', function () {
        form.submit();
    });

    cancel.on('press', function () {
        form.reset();
    });

    form.on('submit', function (data) {
        form.setContent('Submitted.');
        screen.render();
    });

    form.on('reset', function (data) {
        form.setContent('Canceled.');
        screen.render();
    });

    screen.key('q', function () {
        process.exit(0);
    });

    greaterThanEdit.focus();


    screen.render();

})();