import '../../scss/all';
import { Motion, linear } from 'react-motion';
import * as React from 'react';

const { PropTypes } = React;

const rippleComparator = (key: string) =>
    (ripple: RippleUI) => ripple.key === key;

function RippleContainer<T1 extends object>(ComposedComponent: React.StatelessComponent<T1>): React.ComponentClass<T1>;
function RippleContainer<T1 extends object>(ComposedComponent: React.ComponentClass<T1>) : React.ComponentClass<T1>;
function RippleContainer<T1 extends object>(ComposedComponent: any): React.ComponentClass<T1> {
    class RippledComponent extends React.Component<T1, State> {
        static propTypes = {
        }

        static defaultProps = {
        }

        static rippleIdCounter = 0;
        static readonly linearSetting = { velocity: 0.15 };
        static readonly slowLinearSetting = { velocity: 0.05 };
        static readonly rippleRadius = 50;
        static readonly defaultStyle = { scale: 0.5, opacity: 0 };

        constructor(props: T1) {
            super(props);

            this.state = {
                currentRipple: undefined,
                ripples: [],
            };
        }

        releaseRipple(ripples: ReadonlyArray<RippleUI>, key: string): ReadonlyArray<RippleUI> {
            const rippleIndex = ripples.findIndex(rippleComparator(key));
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
            RippledComponent.rippleIdCounter++;
            const key = RippledComponent.rippleIdCounter + '';

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

            const currentRipple = ripples.find(rippleComparator(currentRippleKey));

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
            const rippleIndex = ripples.findIndex(rippleComparator(key));
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

        renderRipples() {
            return this.state.ripples.map(({x, y, key, isPressing}) => (
                <Motion
                    key={key}
                    defaultStyle={RippledComponent.defaultStyle}
                    style={
                        isPressing
                            ? {
                                scale: linear(10, RippledComponent.linearSetting),
                                opacity: linear(1, RippledComponent.linearSetting),
                            }
                            : {
                                scale: linear(10, RippledComponent.linearSetting),
                                opacity: linear(0, RippledComponent.slowLinearSetting),
                            }
                    }
                    onRest={() => { this.onRest(key) }}
                >
                    {({scale, opacity}) => {
                        return (
                            <div
                                style={{
                                    opacity,
                                    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                                }}
                                className="waves-ripple"
                            >
                            </div>
                        );
                    }}
                </Motion>
            ));
        }

        render() {
            const { onPress, onRelease } = this;
            const { children, ...otherProps } = this.props as any;

            const props = {
                onPress,
                onRelease,
                ...otherProps,
            };

            return React.createElement(ComposedComponent, props, [children,  this.renderRipples()]);
        }
    }

    return RippledComponent;
};

export default RippleContainer;

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

export type RippleProps = {
    onPress: (event: React.MouseEvent<HTMLDivElement>) => void;
    onRelease: (event: React.MouseEvent<HTMLDivElement>) => void;
    ripples: ReadonlyArray<JSX.Element>,
};
