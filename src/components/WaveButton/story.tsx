import 'what-input';
import * as React from 'react';
import WaveButton from './WaveButton';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

storiesOf('WaveButton', module)
    .add('with text', () => (
        <WaveButton onClick={action('clicked')}>Hello Button</WaveButton>
    ))
    .add('with some emoji', () => (
        <WaveButton onClick={action('clicked')}>😀 😎 👍 💯</WaveButton>
    ))
;
