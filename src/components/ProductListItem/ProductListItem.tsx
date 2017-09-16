import '../../scss/all';
import * as React from 'react';

const { PropTypes } = React;

const ProductListItem: React.StatelessComponent<Props> = ({
    children,
    imageURL,
    name,
    description,
    price
}: Props) => {
    return (
        <li className="list-card">
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
};

ProductListItem.defaultProps = {
    imageURL: undefined,
    description: undefined,
};

type Props = {
    children?: any;
    readonly imageURL? : string;
    name: string;
    description?: string;
    price: string;
}
