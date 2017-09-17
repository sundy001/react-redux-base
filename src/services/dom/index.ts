export const offset = (elem: HTMLElement) => {
    const box = elem.getBoundingClientRect();
    const docElem = document.documentElement;

    return {
        top: box.top + window.pageYOffset - docElem.clientTop,
        left: box.left + window.pageXOffset - docElem.clientLeft,
    };
};

export const isTouchEvent = (
    event: MouseEvent | TouchEvent,
): event is TouchEvent => (<TouchEvent>event).touches !== undefined;

export const isMouseEvent = (
    event: MouseEvent | TouchEvent,
): event is MouseEvent => (<MouseEvent>event).pageX !== undefined;
