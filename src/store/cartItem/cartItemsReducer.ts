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
import { combineReducers } from 'redux';
import createCartItem from './cartItemFactory';

const removeCartItem = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    id: string,
) => {
    assertEntityExist('cartItems', state, id);

    const byId: app.store.IdStore<app.entity.CartItem> = {...state.byId};
    delete byId[id];

    return {
        byId,
        allIds: state.allIds.filter(theId => theId !== id),
    };
};

const updateCartItem = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    id: string,
    quantity: number,
    options?: ReadonlyArray<app.store.GenericId>
) => {
    assertEntityExist('cartItems', state, id);

    const item = state.byId[id];
    const isOptionsNoUpdate = (options === undefined || isSameOptions(item.options, options));

    if (quantity === item.quantity && isOptionsNoUpdate) {
        return state;
    } else if (quantity < 0) {
        return removeCartItem(state, id);
    } else {
        const updatedItem = {
            ...state.byId[id],
            quantity,
        };

        if (options !== undefined) {
            updatedItem.options = options
        }

        return {
            byId: {
                ...state.byId,
                [id]: updatedItem,
            },
            allIds: state.allIds
        };
    }
};

const addCartItem = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    id: string,
    item: string,
    owner: string,
    quantity: number,
    options: ReadonlyArray<app.store.GenericId>,
) => {
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
) => {
    return addCartItem(state, action.id, action.item, action.owner, action.quantity, action.options);
};

const updateCartItemQuantityByAction = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    action: UpdateCartItemQuantityAction,
) => {
    return updateCartItem(state, action.id, action.quantity);
};

const updateCartItemOptionsByAction = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    action: UpdateCartItemOptionsAction,
) => {
    assertEntityExist('cartItems', state, action.id);

    const targetCartItem = state.byId[action.id];
    const originalOwner = targetCartItem.owner;

    let resultState = state;
    Object.keys(action.quantityMap).forEach(owner => {
        const quantity = action.quantityMap[owner];

        resultState = owner === originalOwner
            ? updateCartItem(resultState, action.id, quantity, action.options)
            : addCartItem(resultState, 'abc', targetCartItem.item, owner, quantity, action.options);
    });

    return resultState;
};

const removeCartItemByAction = (
    state: app.store.ReadonlyStore<app.entity.CartItem>,
    action: RemoveCartItemAction,
) => {
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
