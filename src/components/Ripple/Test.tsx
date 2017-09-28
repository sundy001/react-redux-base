import '../../scss/all';
import Ripple from './Ripple';
import { Motion, linear } from 'react-motion';
import * as React from 'react';

const { PropTypes } = React;

class Test extends React.Component<Props, State> {

    static propTypes = {
    }

    static defaultProps = {
    }

    static rippleIdCounter = 0;
    static readonly linearSetting = { velocity: 0.15 };
    static readonly slowLinearSetting = { velocity: 0.05 };
    static readonly rippleRadius = 50;
    static readonly defaultStyle = { scale: 0.5, opacity: 0 };

    constructor(props: Props) {
        super(props);

        this.state = {
            currentRipple: undefined,
            ripples: [],
        };
    }

    findRipple(ripples: ReadonlyArray<RippleUI>, key: string): RippleUI {
        return ripples.find(ripple => ripple.key === key);
    }

    releaseRipple(ripples: ReadonlyArray<RippleUI>, key: string): ReadonlyArray<RippleUI> {
        const rippleIndex = ripples.findIndex(ripple => ripple.key === key);
        const ripple = ripples[rippleIndex];

        const resultRipples = ripples.slice();
        resultRipples.splice(rippleIndex, 1, {
            ...ripple,
            isPressing: false,
        });

        return resultRipples;
    }

    onPress = (event: React.MouseEvent<HTMLDivElement>): void => {
        const { offsetX, offsetY, timeStamp } = event.nativeEvent;
        Test.rippleIdCounter++;
        const key = Test.rippleIdCounter + '';

        this.setState({
            currentRipple: key,
            ripples: [
                ...this.state.ripples,
                {
                    key,
                    timeStamp,
                    x: offsetX,
                    y: offsetY,
                    isPressing: true,
                },
            ],
        });
    }

    onRelease = (event: React.MouseEvent<HTMLDivElement>): void => {
        const { currentRipple: currentRippleKey, ripples } = this.state;
        if (currentRippleKey === undefined) {
            return;
        }

        const currentRipple = this.findRipple(ripples, currentRippleKey);

        if (event.timeStamp - currentRipple.timeStamp < 700) {
            setTimeout(() => {
                this.setState({
                    ripples: this.releaseRipple(this.state.ripples, currentRippleKey),
                });
            }, 250);
        } else {
            this.setState({
                ripples: this.releaseRipple(ripples, currentRippleKey),
            });
        }

        this.setState({
            currentRipple: undefined,
        });
    }


    onRest = (key: string): void => {
        const { ripples } = this.state;
        const rippleIndex = ripples.findIndex(ripple => ripple.key === key);
        const ripple = ripples[rippleIndex];
        if (ripple.isPressing) {
            return;
        }

        const newRipples = ripples.slice();
        newRipples.splice(rippleIndex, 1);

        this.setState({
            ripples: newRipples,
        });
    }

    render() {
        return (
            <div
                onMouseDown={this.onPress}
                onMouseOut={this.onRelease}
                onMouseUp={this.onRelease}
                style={{
                    border: '1px solid black',
                    width: '300px',
                    height: '300px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {this.state.ripples.map(({x, y, key, isPressing}) => (
                    <Motion
                        key={key}
                        defaultStyle={Test.defaultStyle}
                        style={
                            isPressing
                                ? {
                                    scale: linear(10, Test.linearSetting),
                                    opacity: linear(1, Test.linearSetting),
                                }
                                : {
                                    scale: linear(10, Test.linearSetting),
                                    opacity: linear(0, Test.slowLinearSetting),
                                }
                        }
                        onRest={() => { this.onRest(key) }}
                    >
                        {({scale, opacity}) => {
                            return (
                                <Ripple style={{
                                    opacity,
                                    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                                }} />
                            );
                        }}
                    </Motion>
                ))}
            </div>
        );
    }
}

export default Test;

type Props = {
};

type State = {
    readonly currentRipple?: string;
    readonly ripples: ReadonlyArray<RippleUI>;
};

type RippleUI = {
    readonly key: string;
    readonly timeStamp: number;
    readonly x: number;
    readonly y: number;
    readonly isPressing: boolean;
};
