import 'what-input';
import * as React from 'react';
import RippleContainer, { RippleContainerProps } from './RippleContainer';
import { storiesOf } from '@storybook/react';

const Test2: React.StatelessComponent = (props: RippleContainerProps) => {
    return (
        <div
            onMouseDown={props.onPress}
            onMouseOut={props.onRelease}
            onMouseUp={props.onRelease}
            style={{
                border: '1px solid black',
                width: '300px',
                height: '300px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {props.children}
        </div>
    );
}

const Yo = RippleContainer(Test2);

storiesOf('Ripple', module)
    .add('basic', () => (
        <Yo />
    ))
;
