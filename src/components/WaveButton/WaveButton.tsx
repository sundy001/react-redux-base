import '../../scss/all';
import * as React from 'react';
import * as createClassNames from 'classnames';
import { WaveEffect } from 'components/WaveEffect';
import { Button } from 'components/Button';

const { PropTypes } = React;

const WaveButton: React.StatelessComponent<Props> = ({
    children,
    ...props
}: Props) => {
    return (
        <WaveEffect waveColor="light">
            <Button
                {...props}
            >
                {children}
            </Button>
        </WaveEffect>
    );
}

export default WaveButton;

WaveButton.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

WaveButton.defaultProps = {
    disabled: false
};

type Props = {
    readonly children: any;
    readonly disabled?: boolean;
    readonly onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
}
