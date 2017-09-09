import * as React from 'react';

export default class Container extends React.PureComponent<any, any> {
    static childContextTypes = {
        subscribe: React.PropTypes.func,
        unsubscribe: React.PropTypes.func,
        getParent: React.PropTypes.func
    }

    private events: ReadonlyArray<string>;
    private subscribers:ReadonlyArray<app.ui.StickyEventHandler>;
    private framePending: boolean;
    private node: HTMLDivElement;

    constructor() {
        super();

        this.subscribers = [];
        this.events = [
            'resize',
            'scroll',
            'touchstart',
            'touchmove',
            'touchend',
            'pageshow',
            'load'
        ];
    }

    getChildContext() {
        return {
            subscribe: this.subscribe,
            unsubscribe: this.unsubscribe,
            getParent: this.getParent
        };
    }

    componentDidMount(): void {
        this.events.forEach(event => window.addEventListener(event, this.notifySubscribers as any))
    }

    componentWillUnmount(): void {
        this.events.forEach(event => window.removeEventListener(event, this.notifySubscribers as any))
    }

    subscribe = (handler: app.ui.StickyEventHandler): void => {
        this.subscribers = this.subscribers.concat(handler);
    }

    unsubscribe = (handler: app.ui.StickyEventHandler): void => {
        this.subscribers = this.subscribers.filter(current => current !== handler);
    }

    notifySubscribers = (event: React.UIEvent<HTMLElement> | React.TouchEvent<HTMLElement> | UIEvent) => {
        if (!this.framePending) {
            const { currentTarget } = event;

            requestAnimationFrame(() => {
                this.framePending = false;
                const { top, bottom } = this.node.getBoundingClientRect();

                this.subscribers.forEach(handler => handler({
                    distanceFromTop: top,
                    distanceFromBottom: bottom,
                    eventSource: currentTarget === window ? document.body : this.node
                }));
            });
            this.framePending = true;
        }
    }

    getParent = () => this.node

    render() {
        return (
            <div
                { ...this.props }
                ref={ node => this.node = node }
                onScroll={this.notifySubscribers}
                onTouchStart={this.notifySubscribers}
                onTouchMove={this.notifySubscribers}
                onTouchEnd={this.notifySubscribers}
            />
        );
    }
}
