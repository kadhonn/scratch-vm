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
                    opcode: 'sound',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'robobug.sound',
                        default: 'play a sound',
                        description: 'play a sound'
                    })
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
                                description: 'height, from 0 to 255'
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
                console.log(body.toString());
                if (resolveValue) {
                    resolve(body.toString());
                } else {
                    resolve();
                }
            })
        });
    }

    reset() {
        return this._command("reset");
    }

    sound() {
        return this._command("sound");
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
        let height = args.HEIGHT;
        height = parseInt(height);
        if (isNaN(height)) {
            height = 128;
        }
        height = Math.max(Math.min(height, 255), 0);
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
}

module.exports = RobobugBlocks;
