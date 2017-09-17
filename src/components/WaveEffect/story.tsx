import 'what-input';
import * as React from 'react';
import WaveEffect from './WaveEffect';
import { Button } from 'components/Button';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

storiesOf('WaveEffect', module)
    .add('button', () => (
        <WaveEffect waveColor="light">
            <Button onClick={action('clicked')}>Hello Button</Button>
        </WaveEffect>
    ))
    .add('a tag', () => (
        <WaveEffect waveColor="light">
            <a className="button" onClick={action('clicked')}>Hello Button</a>
        </WaveEffect>
    ))
    .add('div', () => (
        <WaveEffect>
            <div
                style={{
                    width: '100px',
                    height: '100px',
                    border: '1px solid black'
                }}
            >
                box
            </div>
        </WaveEffect>
    ))
;
