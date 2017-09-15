import '../../scss/all';
import * as React from 'react';
import * as createClassNames from 'classnames';

const { PropTypes } = React;

const Button: React.StatelessComponent<Props> = ({
    children,
    ...props
}: Props) => {
    return <button
        className={
            createClassNames('button')
        }
        {...props}
    >
        {children}
    </button>;
}

export default Button;

Button.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

Button.defaultProps = {
    disabled: false
};

type Props = {
    readonly children: any;
    readonly disabled?: boolean;
    readonly onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
}
