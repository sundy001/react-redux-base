import * as React from 'react';
import './style';

type Props = {
    readonly children: any;
    open?: boolean;
};

const Modal = ({
    children,
    open,
    ...props
}: Props) => {
    const style = {
        display: open ? 'block' : 'none',
    };

    return (
        <div>
            <div className="reveal-overlay" style={style} />
            <div className="reveal" {...props} style={style}>
                {children}
            </div>
        </div>
    );
}

export default Modal;
