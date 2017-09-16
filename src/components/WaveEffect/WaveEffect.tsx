import '../../scss/all';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as createClassNames from 'classnames';
import { offset, isMouseEvent, isTouchEvent } from 'services/dom';

const { PropTypes } = React;

export default class WaveEffect extends React.Component<Props> {
    private childElem: HTMLElement;

    static propTypes = {
        children: PropTypes.element.isRequired,
        duration: PropTypes.number,
        isLight: PropTypes.bool,
    }

    static defaultProps = {
        duration: 750,
        isLight: false,
    }

    constructor(props: Props) {
        super(props);
    }

    convertStyle(styleObj: { [prop: string]: string }) {
        let style = '';

        Object.keys(styleObj).forEach(prop => {
            style += `${prop}:${styleObj[prop]};`;
        });

        return style;
    }

    onMouseDown = ({ nativeEvent, target }: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        const element = this.childElem as HTMLElement;
        this.show(nativeEvent, element);
        element.addEventListener('mouseup', this.hide, false);
        element.addEventListener('mouseleave', this.hide, false);
        // TODO: support multiple touches
    }

    /**
     * Hide the effect and remove the ripple. Must be
     * a separate function to pass the JSLint...
     */
    removeRipple(e: Event, el: Element, ripple: Element) {
        // Check if the ripple still exist
        if (!ripple) {
            return;
        }

        ripple.classList.remove('waves-rippling');

        const relativeX = ripple.getAttribute('data-x');
        const relativeY = ripple.getAttribute('data-y');
        const scale = ripple.getAttribute('data-scale');
        const translate = ripple.getAttribute('data-translate');

        // Get delay beetween mousedown and mouse leave
        const diff = Date.now() - Number(ripple.getAttribute('data-hold'));
        let delay = 350 - diff;

        if (delay < 0) {
            delay = 0;
        }

        if (e.type === 'mousemove') {
            delay = 150;
        }

        // Fade out ripple after delay
        const duration = e.type === 'mousemove' ? 2500 : this.props.duration;

        setTimeout(() => {
            const style = {
                top: relativeY + 'px',
                left: relativeX + 'px',
                opacity: '0',

                // Duration
                '-webkit-transition-duration': duration + 'ms',
                '-moz-transition-duration': duration + 'ms',
                '-o-transition-duration': duration + 'ms',
                'transition-duration': duration + 'ms',
                '-webkit-transform': scale + ' ' + translate,
                '-moz-transform': scale + ' ' + translate,
                '-ms-transform': scale + ' ' + translate,
                '-o-transform': scale + ' ' + translate,
                'transform': scale + ' ' + translate
            };

            ripple.setAttribute('style', this.convertStyle(style));

            setTimeout(() => {
                try {
                    el.removeChild(ripple);
                } catch (e) {
                    return false;
                }
            }, duration);

        }, delay);
    }

    show(e: MouseEvent | TouchEvent, element: HTMLElement): void {
        const velocity = false;

        // Disable right click
        if (isMouseEvent(e) && e.button === 2) {
            return;
        }

        // Create ripple
        const ripple = document.createElement('div');
        ripple.className = 'waves-ripple waves-rippling';
        element.appendChild(ripple);

        // Get click coordinate and element width
        const pos = offset(element);
        let relativeY = 0;
        let relativeX = 0;
        // Support for touch devices
        if (isTouchEvent(e) && e.touches.length) {
            relativeY = (e.touches[0].pageY - pos.top);
            relativeX = (e.touches[0].pageX - pos.left);
        } else if (isMouseEvent(e)) {
            relativeY = (e.pageY - pos.top);
            relativeX = (e.pageX - pos.left);
        }
        // Support for synthetic events
        relativeX = relativeX >= 0 ? relativeX : 0;
        relativeY = relativeY >= 0 ? relativeY : 0;

        const scale = `scale(${(element.clientWidth / 100) * 3})`;
        const translate = 'translate(0,0)';

        // if (velocity) {
        //     translate = 'translate(' + (velocity.x) + 'px, ' + (velocity.y) + 'px)';
        // }

        // Attach data to element
        ripple.setAttribute('data-hold', Date.now().toString());
        ripple.setAttribute('data-x', relativeX + '');
        ripple.setAttribute('data-y', relativeY + '');
        ripple.setAttribute('data-scale', scale);
        ripple.setAttribute('data-translate', translate);

        // Set ripple position
        const rippleStyle: any = {
            top: relativeY + 'px',
            left: relativeX + 'px',
        };

        ripple.classList.add('waves-notransition');
        ripple.setAttribute('style', this.convertStyle(rippleStyle));
        ripple.classList.remove('waves-notransition');

        // Scale the ripple
        rippleStyle['-webkit-transform'] = scale + ' ' + translate;
        rippleStyle['-moz-transform'] = scale + ' ' + translate;
        rippleStyle['-ms-transform'] = scale + ' ' + translate;
        rippleStyle['-o-transform'] = scale + ' ' + translate;
        rippleStyle.transform = scale + ' ' + translate;
        rippleStyle.opacity = '1';

        const duration = e.type === 'mousemove' ? 2500 : this.props.duration;
        rippleStyle['-webkit-transition-duration'] = duration + 'ms';
        rippleStyle['-moz-transition-duration'] = duration + 'ms';
        rippleStyle['-o-transition-duration'] = duration + 'ms';
        rippleStyle['transition-duration'] = duration + 'ms';

        ripple.setAttribute('style', this.convertStyle(rippleStyle));
    }

    hide = (e: Event): void => {
        const element = e.target as HTMLElement;
        const ripples = Array.from(element.getElementsByClassName('waves-rippling'));

        ripples.forEach(ripple => {
            this.removeRipple(e, element, ripple);
        });

        element.removeEventListener('touchend', this.hide);
        element.removeEventListener('touchcancel', this.hide);
        element.removeEventListener('mouseup', this.hide);
        element.removeEventListener('mouseleave', this.hide);
    }

    componentDidMount() {
        const currentDom = ReactDOM.findDOMNode(this);
        const childElem = currentDom.childNodes[0] as HTMLElement;
        this.childElem = childElem;
        childElem.classList.add('waves-effect');
        if (this.props.isLight) {
            childElem.classList.add('waves-light');
        }
    }

    render() {
        return (
            <div
                style={{width: '100%'}}
                onMouseDown={this.onMouseDown}
                onTouchStart={this.onMouseDown}
            >
                {React.Children.only(this.props.children)}
            </div>
        );
    }
}

type Props = {
    children: React.ReactNode;
    duration?: number;
    isLight?: boolean;
}
