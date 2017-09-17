import { random } from 'faker';
import { app } from './faker';
import { createCartItem } from 'store/cartItems';

const valueOrDefault = <T>(value: T, defaultValue: T): T => {
    return value !== undefined ? value : defaultValue;
};

export const createRandomCartItem = (
    id?: string,
    item?: string,
    owner?: string,
    quantity?: number,
    options?: ReadonlyArray<app.store.GenericId>,
): app.entity.CartItem => {

    return createCartItem(
        valueOrDefault(id, app.entityId('cartItem')),
        valueOrDefault(item, app.entityId('item')),
        valueOrDefault(owner, app.entityId('owner')),
        valueOrDefault(quantity, random.number({ min: 1, max: 20 })),
        valueOrDefault(options, app.genericIds('topping')),
    );
};
