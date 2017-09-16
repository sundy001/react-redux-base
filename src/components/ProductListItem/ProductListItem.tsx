import '../../scss/all';
import * as React from 'react';

const { PropTypes } = React;

const ProductListItem: React.StatelessComponent<Props> = ({
    children,
    imageURL,
    name,
    description,
    price,
    onClick,
}: Props) => {
    return (
        <li
            className="list-card"
            onClick={onClick}
        >
            {imageURL &&
                <div
                    className="list-card-image"
                    style={{
                        backgroundImage: `url(${imageURL})`,
                    }}
                ></div>
            }
            <div className="list-cart-section">
                <div className="product-header">
                    <h3 className="name h6">{name}</h3>
                    <span className="price h6">{price}</span>
                </div>
                {description &&
                    <p className="subheader">
                        {description}
                    </p>
                }
                {children}
            </div>
        </li>
    );
}

export default ProductListItem;

ProductListItem.propTypes = {
    imageURL: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.string.isRequired,
    onClick: PropTypes.func,
};

ProductListItem.defaultProps = {
    imageURL: undefined,
    description: undefined,
};

type Props = {
    readonly children?: any;
    readonly imageURL? : string;
    readonly name: string;
    readonly description?: string;
    readonly price: string;
    readonly onClick?: React.EventHandler<React.MouseEvent<HTMLLIElement>>;
}
