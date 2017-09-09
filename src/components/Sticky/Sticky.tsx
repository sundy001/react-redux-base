import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default class Sticky extends React.Component<Props, States> {

    static propTypes = {
        relative: React.PropTypes.bool,
        topOffset: React.PropTypes.number,
        bottomOffset: React.PropTypes.number,
        children: React.PropTypes.func.isRequired
    }

    static defaultProps = {
        relative: false,
        topOffset: 0,
        bottomOffset: 0,
        disableCompensation: false,
        disableHardwareAcceleration: false
    }

    static contextTypes = {
        subscribe: React.PropTypes.func,
        unsubscribe: React.PropTypes.func,
        getParent: React.PropTypes.func
    }

    private placeholder: HTMLDivElement;
    private content: HTMLElement;

    state = {
        isSticky: false,
        wasSticky: false,
        distanceFromTop: 0,
        distanceFromBottom: 0,
        calculatedHeight: 0,
        style: { },
    }

    componentWillMount() {
        if (!this.context.subscribe) throw new TypeError("Expected Sticky to be mounted within StickyContainer");

        this.context.subscribe(this.handleContainerEvent)
    }

    componentWillUnmount(): void {
        this.context.unsubscribe(this.handleContainerEvent)
    }

    componentDidUpdate(): void {
        this.placeholder.style.paddingBottom = this.props.disableCompensation ? '0' : `${this.state.isSticky ? this.state.calculatedHeight : 0}px`
    }

    handleContainerEvent = (
            { distanceFromTop, distanceFromBottom, eventSource }: app.ui.StickyEvent
    ): void => {
        const parent = this.context.getParent();

        let preventingStickyStateChanges = false;
        if (this.props.relative) {
                preventingStickyStateChanges = eventSource !== parent;
                distanceFromTop = -(eventSource.scrollTop + eventSource.offsetTop) + this.placeholder.offsetTop
        }

        const placeholderClientRect = this.placeholder.getBoundingClientRect();
        const contentClientRect = this.content.getBoundingClientRect();
        const calculatedHeight = contentClientRect.height;

        const bottomDifference = distanceFromBottom - this.props.bottomOffset - calculatedHeight;

        const wasSticky = !!this.state.isSticky;
        const isSticky = preventingStickyStateChanges ? wasSticky : (distanceFromTop <= -this.props.topOffset && distanceFromBottom > -this.props.bottomOffset);

        distanceFromBottom = (this.props.relative ? parent.scrollHeight - parent.scrollTop : distanceFromBottom) - calculatedHeight;

        const style: any = !isSticky ? { } : {
            position: 'fixed',
            top: bottomDifference > 0 ? (this.props.relative ? parent.offsetTop - parent.offsetParent.scrollTop : 0) : bottomDifference,
            left: placeholderClientRect.left,
            width: placeholderClientRect.width
        }

        if (!this.props.disableHardwareAcceleration) {
            style.transform = 'translateZ(0)';
        }

        this.setState({
            isSticky,
            wasSticky,
            distanceFromTop,
            distanceFromBottom,
            calculatedHeight,
            style
        });
    };

    render() {
        const element = React.cloneElement(
            this.props.children({
                isSticky: this.state.isSticky,
                wasSticky: this.state.wasSticky,
                distanceFromTop: this.state.distanceFromTop,
                distanceFromBottom: this.state.distanceFromBottom,
                calculatedHeight: this.state.calculatedHeight,
                style: this.state.style
            }),
            { ref: (content: HTMLElement) => { this.content = ReactDOM.findDOMNode(content); } }
        )

        return (
            <div>
                <div ref={ placeholder => this.placeholder = placeholder } />
                { element }
            </div>
        )
    }
}

type Props = {
    relative?: boolean;
    topOffset?: number;
    bottomOffset?: number;
    disableCompensation?: boolean;
    disableHardwareAcceleration?: boolean;
    children: (state: States) => React.ReactElement<any>;
};

type States = {
    isSticky: boolean;
    wasSticky: boolean;
    distanceFromTop: number;
    distanceFromBottom: number;
    calculatedHeight: number;
    style: any;
};
