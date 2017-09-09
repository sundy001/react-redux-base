import './style';
import * as React from 'react';

type Props = {
    readonly children: any;
    readonly disabled?: boolean;
    readonly onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
};

const Button = ({
    children,
    ...props
}: Props) => {
    return <button className="button" {...props}>{children}</button>;
}

export default Button;
