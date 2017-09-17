import 'what-input';
import * as React from 'react';
import Modal from './Modal';
import { storiesOf } from '@storybook/react';

storiesOf('Modal', module)
    .add('basic', () => (
        <Modal open>Hello Button</Modal>
    ))
;
