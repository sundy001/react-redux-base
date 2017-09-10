import TYPES from 'TYPES';
import container from 'inversify.config';
import {
    ADD_CART_ITEM,
    UPDATE_CART_ITEM_QUANTITY,
    UPDATE_CART_ITEM_OPTIONS,
    REMOVE_CART_ITEM,
    AddCartItemAction,
    UpdateCartItemQuantityAction,
    UpdateCartItemOptionsAction,
    RemoveCartItemAction,
} from './cartItemsActions';
import { assertEntityExist, assertEntitiesExist } from 'services/assets';
import { findIdentityItem, isSameOptions } from 'services/cart';
import createCartItem from './cartItemFactory';

const idGenerator = container.get<app.services.IdGeneratorInterface>(TYPES.IdGenerator);

const removeCartItem = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    id: string,
): app.store.ReadonlyStore<app.entity.CartItem> => {
    assertEntityExist('cartItems', state, id);

    const byId: app.store.IdStore<app.entity.CartItem> = {...state.byId};
    delete byId[id];

    return {
        byId,
        allIds: state.allIds.filter(theId => theId !== id),
    };
};

const updateCartItemQuantityAndOptions = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    id: string,
    quantity: number,
    options?: ReadonlyArray<app.store.GenericId>
): app.store.ReadonlyStore<app.entity.CartItem> => {
    const item = {
        ...state.byId[id],
        quantity,
    };

    if (options !== undefined) {
        item.options = options;
    }

    return {
        byId: {
            ...state.byId,
            [id]: item,
        },
        allIds: state.allIds
    };
}

const updateCartItem = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    id: string,
    quantity: number,
    options?: ReadonlyArray<app.store.GenericId>
): app.store.ReadonlyStore<app.entity.CartItem> => {
    assertEntityExist('cartItems', state, id);

    const cartItem = state.byId[id];
    const isOptionsNoUpdate = (options === undefined || isSameOptions(cartItem.options, options));

    if (quantity === cartItem.quantity && isOptionsNoUpdate) {
        return state;
    } else if (quantity < 0) {
        return removeCartItem(state, id);
    } else if (options !== undefined) {
        const existingItemId = findIdentityItem(options, cartItem.item, cartItem.owner, state.byId);

        if (existingItemId === undefined) {
            return updateCartItemQuantityAndOptions(state, id, quantity, options);
        } else {
            const tempState = removeCartItem(state, id);
            return updateCartItemQuantityAndOptions(tempState, existingItemId, state.byId[existingItemId].quantity + quantity);
        }
    } else {
        return updateCartItemQuantityAndOptions(state, id, quantity, options);
    }
};

const addCartItem = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    id: string,
    item: string,
    owner: string,
    quantity: number,
    options: ReadonlyArray<app.store.GenericId>,
): app.store.ReadonlyStore<app.entity.CartItem> => {
    const existingItemId = findIdentityItem(options, item, owner, state.byId);

    if (existingItemId === undefined) {
        return {
            byId: {
                ...state.byId,
                [id]: createCartItem(id, item, owner, quantity, options)
            },
            allIds: [ ...state.allIds, id ]
        };
    } else {
        return updateCartItem(state, existingItemId, state.byId[existingItemId].quantity + quantity);
    }
}

const addCartItemByAction = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    action: AddCartItemAction,
): app.store.ReadonlyStore<app.entity.CartItem> => {
    return addCartItem(state, action.id, action.item, action.owner, action.quantity, action.options);
};

const updateCartItemQuantityByAction = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    action: UpdateCartItemQuantityAction,
): app.store.ReadonlyStore<app.entity.CartItem> => {
    return updateCartItem(state, action.id, action.quantity);
};

const updateCartItemOptionsByAction = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    action: UpdateCartItemOptionsAction,
): app.store.ReadonlyStore<app.entity.CartItem> => {
    assertEntityExist('cartItems', state, action.id);

    const targetCartItem = state.byId[action.id];
    const originalOwner = targetCartItem.owner;

    let resultState = state;
    Object.keys(action.quantityMap).forEach(owner => {
        const quantity = action.quantityMap[owner];

        resultState = owner === originalOwner
            ? updateCartItem(resultState, action.id, quantity, action.options)
            : addCartItem(resultState, idGenerator.generate('cartItem'), targetCartItem.item, owner, quantity, action.options);
    });

    return resultState;
};

const removeCartItemByAction = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    action: RemoveCartItemAction,
): app.store.ReadonlyStore<app.entity.CartItem> => {
    return removeCartItem(state, action.id);
};

export default (state: app.store.ReadonlyStore<app.entity.CartItem>, action: Action): app.store.ReadonlyStore<app.entity.CartItem> => {
    switch(action.type) {
        case UPDATE_CART_ITEM_QUANTITY: return updateCartItemQuantityByAction(state, action);
        case ADD_CART_ITEM: return addCartItemByAction(state, action);
        case UPDATE_CART_ITEM_OPTIONS: return updateCartItemOptionsByAction(state, action);
        case REMOVE_CART_ITEM: return removeCartItemByAction(state, action);
        default: return state;
    }
};

type Action = AddCartItemAction | UpdateCartItemQuantityAction | UpdateCartItemOptionsAction | RemoveCartItemAction;
