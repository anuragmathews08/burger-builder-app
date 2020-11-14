import React, { useEffect, useState, useCallback } from 'react';
import Aux from '../../hoc/Auxilary/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import { useDispatch, useSelector } from 'react-redux';
import * as burgerBuilderActions from '../../store/actions/index';


export const BurgerBuilder = props => {

    const [purchasing, setPurchasing] = useState(false);

    const ings = useSelector(state => {
        return state.burgerBuilder.ingredients;
    });

    const price = useSelector(state => {
        return state.burgerBuilder.totalPrice;
    });

    const error = useSelector(state => {
        return state.burgerBuilder.error;
    });

    const isAuthenticated = useSelector(state => {
        return state.auth.token !== null;
    });

    const dispatch = useDispatch();
    const onIngredientAdded = (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName));
    const onIngredientRemoved = (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName));
    const onInitIngredients = useCallback(() => dispatch(burgerBuilderActions.initIngredients()), [dispatch]);
    const onSetAuthRedirectPath = (path) => dispatch(burgerBuilderActions.setAuthRedirectPath(path));

    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients]);

    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        }).reduce((sum, el) => {
            return sum + el;
        }, 0);
        return sum > 0;

    }


    const purchaseHandler = () => {
        if (isAuthenticated) {
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }

    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        props.history.push('/checkout');
    }


    const disabledInfo = {
        ...ings
    };

    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
    if (ings) {

        burger = (
            <Aux>
                <Burger ingredients={ings} />
                <BuildControls
                    ingredientsAdded={onIngredientAdded}
                    ingredientRemoved={onIngredientRemoved}
                    purchaseable={updatePurchaseState(ings)}
                    disabled={disabledInfo}
                    price={price}
                    isAuth={isAuthenticated}
                    ordered={purchaseHandler} />
            </Aux>);
        orderSummary = <OrderSummary
            ingredients={ings}
            price={price}
            purchaseCancelled={purchaseCancelHandler}
            purchaseContinued={purchaseContinueHandler} />;
    }

    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );
}


export default withErrorHandler(BurgerBuilder, axios);