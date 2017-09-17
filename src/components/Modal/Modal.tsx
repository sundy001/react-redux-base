import '../../scss/all';
import * as React from 'react';
import * as createClassNames from 'classnames';

const { PropTypes } = React;

const Modal: React.StatelessComponent<Props> = ({
    children,
    open,
    ...props
}: Props) => {
    const style = {
        display: open ? 'block' : 'none',
    };

    return (
        <div>
            <div
                className="reveal-overlay"
                style={style}
            />
            <div
                className="reveal" {...props}
                style={style}
            >
                {children}
            </div>
        </div>
    );
}

export default Modal;

Modal.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
    open: PropTypes.bool,
};

Modal.defaultProps = {
    open: false,
};

type Props = {
    readonly children: any;
    readonly open?: boolean;
}
