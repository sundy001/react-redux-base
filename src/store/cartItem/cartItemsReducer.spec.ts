import 'jest';
import { cloneDeep } from 'lodash';
import { ADD_CART_ITEM, addCartItem, updateCartItemQuantity, updateCartItemOptions, removeCartItem  } from './cartItemsActions';
import cartItems from './cartItemsReducer';
import {
    createAddExpectation,
    entityNotFoundShouldThrowError,
    storeShouldBeImmutable,
    storeByIdShouldBeImmutable,
    propertyShouldBeImmutable,
    createRandomCartItem,
} from 'services/test';

describe('cartsReducer', function(this: TestEnv) {
    beforeEach(() => {
        this.store = {
            byId:{
                cartItem1: {id: 'cartItem1', item: 'item1', owner: 'owner2', quantity: 3, options: []},
                cartItem2: {
                    id: 'cartItem2',
                    item: 'item2',
                    owner: 'owner2',
                    quantity: 5,
                    options: [
                        {type: 'topping', id: 'topping1'},
                        {type: 'topping', id: 'topping2'},
                        {type: 'topping', id: 'topping3'},
                    ]
                },
                cartItem3: {id: 'cartItem3', item: 'item3', owner: 'owner3', quantity: 7, options: []},
            },
            allIds:['cartItem1', 'cartItem2', 'cartItem3']
        };
    });

    describe('#AddCartItemAction', () => {
        it('should add item when the store is empty', () => {
            const newItem: app.entity.CartItem = createRandomCartItem('cartItem9', 'item9');
            const initState: app.store.ReadonlyStore<app.entity.CartItem> = { byId:{}, allIds:[] };

            const result = cartItems(initState, {
                ...newItem,
                type: ADD_CART_ITEM,
            });

            expect(result).toEqual({
                byId: {
                    [newItem.id]: newItem,
                },
                allIds: [ newItem.id ]
            });
        });

        it('should append new item at tail when new item added', () => {
            const newItem: app.entity.CartItem = createRandomCartItem('cartItem9', 'item9');
            const expectation = createAddExpectation(this.store, newItem);

            const result = cartItems(this.store, {
                type: ADD_CART_ITEM,
                ...newItem,
            });

            expect(result).toEqual(expectation);
        });

        it('should sum item quantity when item has same itemId, ownerId and options', () => {
            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            expectation.byId.cartItem1.quantity += 5;

            const result = cartItems(this.store, {
                type: ADD_CART_ITEM,
                id: 'cartItem9',
                item: this.store.byId.cartItem1.item,
                owner: this.store.byId.cartItem1.owner,
                quantity: 5,
                options: this.store.byId.cartItem1.options,
            });

            expect(result).toEqual(expectation);
        });

        it('should sum item quantity when item has same itemId, ownerId and options, even if options order is different', () => {
            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            expectation.byId.cartItem2.quantity += 2;

            const result = cartItems(this.store, {
                type: ADD_CART_ITEM,
                id: 'cartItem9',
                item: this.store.byId.cartItem2.item,
                owner: this.store.byId.cartItem2.owner,
                quantity: 2,
                options: [
                    { type: 'topping', id: 'topping3' },
                    { type: 'topping', id: 'topping1' },
                    { type: 'topping', id: 'topping2' },
                ],
            });

            expect(result).toEqual(expectation);
        });

        it('should not sum item quantity when item has same ownerId and options but different itemId', () => {
            const newItem: app.entity.CartItem = createRandomCartItem('cartItem9', 'item4', 'owner2');
            const expectation = createAddExpectation(this.store, newItem);

            const result = cartItems(this.store, {
                type: ADD_CART_ITEM,
                ...newItem,
            });

            expect(result).toEqual(expectation);
        });

        it('should not sum item quantity when item has same itemId and options but different ownerId', () => {
            const newItem: app.entity.CartItem = createRandomCartItem('cartItem9', 'item3', 'owner4');
            const expectation = createAddExpectation(this.store, newItem);

            const result = cartItems(this.store, {
                type: ADD_CART_ITEM,
                ...newItem,
            });

            expect(result).toEqual(expectation);
        });

        it('should not sum item quantity when item has same itemId and ownerId but different options', () => {
            const newItem: app.entity.CartItem = createRandomCartItem('cartItem9', 'item1', 'owner2', undefined, [ { type: 'topping', id: 'topping1' } ]);
            const expectation = createAddExpectation(this.store, newItem);

            const result = cartItems(this.store, {
                type: ADD_CART_ITEM,
                ...newItem,
            });

            expect(result).toEqual(expectation);
        });

        storeShouldBeImmutable(this)(cartItems, addCartItem('cartItem9', 'item2', 'owner2', 3, []));
    });

    describe('#updateCartItemQuantity', () => {
        it('should update item quantity', () => {
            const TEST_QUANTITY = 8;

            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            expectation.byId.cartItem2.quantity = TEST_QUANTITY;
            const action = updateCartItemQuantity('cartItem2', TEST_QUANTITY);

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        it('should return ideintity item object when quantity is same', () => {
            const targetItem = this.store.byId.cartItem2;
            const action = updateCartItemQuantity(targetItem.id, targetItem.quantity);

            const result = cartItems(this.store, action);

            expect(result).toBe(this.store);
        });

        it('should remove item when quantity is smaller or equal to 0', () => {
            const TEST_CART_ITEM_ID = 'cartItem2';
            const expectation = cloneDeep(this.store) as app.store.Store<app.entity.CartItem>;
            delete expectation.byId[TEST_CART_ITEM_ID];
            expectation.allIds = expectation.allIds.filter(id => id !== TEST_CART_ITEM_ID);
            const action = updateCartItemQuantity('cartItem2', -9);

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        storeByIdShouldBeImmutable(this)(cartItems, updateCartItemQuantity('cartItem1', 9));
        entityNotFoundShouldThrowError(this)(cartItems, updateCartItemQuantity('cartItem10', 9));
    });

    describe('#updateCartItemOptions', () => {
        it('should update item options and quantity', () => {
            const TEST_QUANTITY = 6;
            const TEST_CART_ITEM_ID = 'cartItem1';

            const expectation = cloneDeep(this.store) as app.store.Store<CartItem>;
            const cartItem = expectation.byId[TEST_CART_ITEM_ID];
            cartItem.options = [{type: 'topping', id: 'topping1'}];
            cartItem.quantity = TEST_QUANTITY;
            const action = updateCartItemOptions(TEST_CART_ITEM_ID, cartItem.options, {
                [cartItem.owner]: TEST_QUANTITY
            });

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        const action = updateCartItemOptions('cartItem1', [], { 'owner2': 1 });
        storeByIdShouldBeImmutable(this)(cartItems, action);
        // propertyShouldBeImmutable(this)(cartItems, action, '[0].options');
        // entityNotFoundShouldThrowError(this)(cartItems, removeCartItem('cartItem10'));
    });

    describe('#removeCartItem', () => {
        it('should remove item', () => {
            const TEST_CART_ITEM_ID = 'cartItem2';
            const expectation = cloneDeep(this.store) as app.store.Store<app.entity.CartItem>;
            delete expectation.byId[TEST_CART_ITEM_ID];
            expectation.allIds = expectation.allIds.filter(id => id !== TEST_CART_ITEM_ID);
            const action = removeCartItem(TEST_CART_ITEM_ID);

            const result = cartItems(this.store, action);

            expect(result).toEqual(expectation);
        });

        storeShouldBeImmutable(this)(cartItems, removeCartItem('cartItem1'));
        entityNotFoundShouldThrowError(this)(cartItems, removeCartItem('cartItem10'));
    });
});

interface CartItem extends app.store.Entity {
    item: string;
    owner: string;
    quantity: number;
    options: ReadonlyArray<app.store.GenericId>;
}

type TestEnv = {
    store: app.store.ReadonlyStore<app.entity.CartItem>
}
