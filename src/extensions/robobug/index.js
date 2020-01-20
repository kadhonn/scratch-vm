const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const Clone = require('../../util/clone');
const Color = require('../../util/color');
const formatMessage = require('format-message');
const MathUtil = require('../../util/math-util');
const RenderedTarget = require('../../sprites/rendered-target');
const log = require('../../util/log');
const StageLayering = require('../../engine/stage-layering');
const nets = require('nets');


class RobobugBlocks {
    constructor(runtime) {
        this.runtime = runtime;

    }

    getInfo() {
        return {
            id: 'robobug',
            name: formatMessage({
                id: 'robobug.categoryName',
                default: 'Robobug',
                description: 'Label for the robobug extension category'
            }),
            blocks: [
                {
                    opcode: 'reset',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'robobug.reset',
                        default: 'reset robobug',
                        description: 'reset the robobug'
                    })
                },
                {
                    opcode: 'powerOn',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'robobug.powerOn',
                        default: 'power on',
                        description: 'tell the robobug to power on'
                    })
                },
                {
                    opcode: 'powerOff',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'robobug.powerOff',
                        default: 'power off',
                        description: 'tell the robobug to power off'
                    })
                },
                {
                    opcode: 'sound',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'robobug.sound',
                        default: 'play a sound. duration: [DURATION] frequency: [FREQUENCY]',
                        description: 'play a sound'
                    }),
                    arguments: {
                        DURATION: {
                            type: ArgumentType.NUMBER,
                            defaultValue: formatMessage({
                                id: 'robobug.sound.duration',
                                default: '10',
                                description: 'duration in ms, from 0 to 255'
                            })
                        },
                        FREQUENCY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: formatMessage({
                                id: 'robobug.sound.frequency',
                                default: '1200',
                                description: 'frquency of tone, from 0 to 2550'
                            })
                        }
                    }
                },
                {
                    opcode: 'bodyHeight',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'robobug.bodyHeight',
                        default: 'height: [HEIGHT]',
                        description: 'change the height of the robobug'
                    }),
                    arguments: {
                        HEIGHT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: formatMessage({
                                id: 'robobug.bodyHeight.height',
                                default: '60',
                                description: 'height, from 0 to 100'
                            })
                        }
                    }
                },
                {
                    opcode: 'speed',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'robobug.speed',
                        default: 'speed: [SPEED]',
                        description: 'change the speed of the robobug, from 0 to 100'
                    }),
                    arguments: {
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: formatMessage({
                                id: 'robobug.speed.speed',
                                default: '50',
                                description: 'speed, from 0 to 100'
                            })
                        }
                    }
                },
                {
                    opcode: 'walk',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'robobug.walk',
                        default: 'walk forward: [FORWARD] sideward: [SIDE] turn:[TURN]',
                        description: 'tell the robobug to walk forward'
                    }),
                    arguments: {
                        FORWARD: {
                            type: ArgumentType.NUMBER,
                            defaultValue: formatMessage({
                                id: 'robobug.walk.forward',
                                default: '0',
                                description: 'forward or backward speed, from -100 to 100'
                            })
                        },
                        SIDE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: formatMessage({
                                id: 'robobug.walk.side',
                                default: '0',
                                description: 'left or right speed, from -100 to 100'
                            })
                        },
                        TURN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: formatMessage({
                                id: 'robobug.walk.turn',
                                default: '0',
                                description: 'turn left or right while walking, from -100 to 100'
                            })
                        }
                    }
                },
                {
                    opcode: 'walkForward',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'robobug.walkForward',
                        default: 'walk forward',
                        description: 'tell the robobug to walk forward'
                    })
                },
                {
                    opcode: 'walkBack',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'robobug.walkBack',
                        default: 'walk back',
                        description: 'tell the robobug to walk back'
                    })
                },
                {
                    opcode: 'walkLeft',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'robobug.walkLeft',
                        default: 'walk left',
                        description: 'tell the robobug to walk left'
                    })
                },
                {
                    opcode: 'walkRight',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'robobug.walkRight',
                        default: 'walk right',
                        description: 'tell the robobug to walk right'
                    })
                },
                {
                    opcode: 'walkStop',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'robobug.walkStop',
                        default: 'stop walking',
                        description: 'tell the robobug to stop walking'
                    })
                },
                {
                    opcode: 'akkuCharge',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'robobug.akkuCharge',
                        default: 'akku charge',
                        description: 'gets you the akku charge of the robobug'
                    })
                },
            ],
            menus: {
            }
        };
    }

    _command(cmd) {
        return this._send(cmd, false);
    }

    _reporter(cmd) {
        return this._send(cmd, true);
    }

    _send(cmd, resolveValue) {
        console.log(cmd);

        return new Promise(resolve => {
            nets({ url: "http://localhost:8080/" + cmd }, function (err, resp, body) {
                console.log(err);
                console.log(resp);
                console.log(body);
                if (resolveValue && !!body) {
                    resolve(body.toString());
                } else {
                    resolve();
                }
            })
        });
    }

    _parseArg(value, min, max, defaultValue) {
        value = parseInt(value);
        if (isNaN(value)) {
            value = defaultValue;
        }
        value = Math.max(Math.min(value, max), min);
        return value
    }

    reset() {
        return this._command("reset");
    }

    sound(args) {
        let duration = this._parseArg(args.DURATION, 0, 255, 10);
        let frequency = this._parseArg(args.FREQUENCY, 0, 2550, 1200);
        return this._command("sound?duration=" + duration + "&frequency=" + frequency);
    }

    walkForward() {
        return this._command("walk_forward");
    }

    walkBack() {
        return this._command("walk_back");
    }

    walkLeft() {
        return this._command("walk_left");
    }

    walkRight() {
        return this._command("walk_right");
    }

    walkStop() {
        return this._command("walk_stop");
    }

    bodyHeight(args) {
        let height = this._parseArg(args.HEIGHT, 0, 100, 60);
        return this._command("body_height?height=" + height);
    }

    powerOn() {
        return this._command("power_on");
    }

    powerOff() {
        return this._command("power_off");
    }

    akkuCharge() {
        return this._reporter("akku_charge");
    }

    speed(args) {
        let speed = this._parseArg(args.SPEED, 0, 100, 50);
        return this._command("speed?speed=" + speed);
    }

    walk(args) {
        let forward = this._parseArg(args.FORWARD, -100, 100, 0);
        let side = this._parseArg(args.SIDE, -100, 100, 0);
        let turn = this._parseArg(args.TURN, -100, 100, 0);
        return this._command("walk?forward=" + forward + "&side=" + side + "&turn=" + turn);
    }
}

module.exports = RobobugBlocks;
