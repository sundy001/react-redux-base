import 'what-input';
import * as React from 'react';
import ProductListItem from './ProductListItem';
import { WaveEffect } from 'components/WaveEffect';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

storiesOf('ProductListItem', module)
    .add('basic', () => (
        <ul className="list">
            <ProductListItem
                imageURL="https://unsplash.it/300/200?image=292"
                name="Ramly (Malaysia Burger)"
                description="Spiegelei, Ziegenkäse, Ketchup &amp; Mayo, hausgemachte Soße, frisch gegrilltes Rindfleisch"
                price="€6.80"
                onClick={action('clicked')}
            >
            </ProductListItem>
        </ul>
    ))
    .add('no image', () => (
        <ul className="list">
            <ProductListItem
                name="Ramly (Malaysia Burger)"
                description="Spiegelei, Ziegenkäse, Ketchup &amp; Mayo, hausgemachte Soße, frisch gegrilltes Rindfleisch"
                price="€6.80"
                onClick={action('clicked')}
            ></ProductListItem>
        </ul>
    ))
    .add('with wave effect', () => (
        <ul className="list">
            <WaveEffect waveColor="brand">
                <ProductListItem
                    imageURL="https://unsplash.it/300/200?image=292"
                    name="Ramly (Malaysia Burger)"
                    description="Spiegelei, Ziegenkäse, Ketchup &amp; Mayo, hausgemachte Soße, frisch gegrilltes Rindfleisch"
                    price="€6.80"
                    onClick={action('clicked')}
                >
                </ProductListItem>
            </WaveEffect>
        </ul>
    ))
    .add('demo', () => (
        <ul className="list">
            <WaveEffect waveColor="brand">
                <ProductListItem
                    imageURL="https://unsplash.it/300/200?image=292"
                    name="Ramly (Malaysia Burger)"
                    description="Spiegelei, Ziegenkäse, Ketchup &amp; Mayo, hausgemachte Soße, frisch gegrilltes Rindfleisch"
                    price="€6.80"
                    onClick={action('clicked')}
                >
                </ProductListItem>
            </WaveEffect>
            <WaveEffect waveColor="brand">
                <ProductListItem
                    imageURL="https://unsplash.it/300/200?image=1080"
                    name="Big Mama (double-Beef double-Cheese)"
                    description="Cheddarkäse, Ketchup &amp; Mayo, hausgemachte Soße, zwei gegrillte Rindfleischscheiben"
                    price="€9.30"
                    onClick={action('clicked')}
                >
                </ProductListItem>
            </WaveEffect>
            <WaveEffect waveColor="brand">
                <ProductListItem
                    name="Ramly (Malaysia Burger)"
                    description="Spiegelei, Ziegenkäse, Ketchup &amp; Mayo, hausgemachte Soße, frisch gegrilltes Rindfleisch"
                    price="€6.80"
                    onClick={action('clicked')}
                ></ProductListItem>
            </WaveEffect>
            <WaveEffect waveColor="brand">
                <ProductListItem
                    name="Ramly (Malaysia Burger)"
                    description="Spiegelei, Ziegenkäse, Ketchup &amp; Mayo, hausgemachte Soße, frisch gegrilltes Rindfleisch"
                    price="€6.80"
                    onClick={action('clicked')}
                ></ProductListItem>
            </WaveEffect>
        </ul>
    ))
;
