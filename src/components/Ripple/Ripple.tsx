import '../../scss/all';
import * as React from 'react';

const { PropTypes } = React;

const Ripple: React.StatelessComponent<Props> = ({
    ...props
}: Props) => {
    return (
        <div
            { ...props }
            className="waves-ripple"
        >
        </div>
    );
}

export default Ripple;

Ripple.propTypes = {
};

Ripple.defaultProps = {
};

type Props = {
} & React.ButtonHTMLAttributes<HTMLDivElement>
