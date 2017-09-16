import '../../scss/all';
import * as React from 'react';

const { PropTypes } = React;

const ListCard: React.StatelessComponent<Props> = ({
}: Props) => {
    return (
        <li>
            <div>image</div>
            <h3>(5) Burger Party</h3>
            <p>
                8 McDonald’s Highlights für deine Party zu Hause (je 2x4 Klassiker nach Wahl)
            </p>
            <span>24,99 €</span>
            <i className="fa fa-plus" aria-hidden="true"></i>
        </li>
    );
}

export default ListCard;

ListCard.propTypes = {
};

ListCard.defaultProps = {
};

type Props = {
}
