import React, { useState } from 'react';
import { connect } from 'react-redux';
import Aux from '../Auxilary/Auxilary';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout = props => {

    const [showSideDrawer, setSideDrawer] = useState(false);

    const sideDrawerClosedHandler = () => {
        setSideDrawer(false);
    }

    const sideDrawerToggleHandler = () => {
        setSideDrawer(!showSideDrawer);
    }

    return (
        <Aux>
            <Toolbar
                isAuth={props.isAuthenticated}
                drawerToggleClicked={sideDrawerToggleHandler} />
            <SideDrawer
                isAuth={props.isAuthenticated}
                open={showSideDrawer}
                closed={sideDrawerClosedHandler} />
            <main className={classes.content}>
                {props.children}
            </main>
        </Aux>
    );

}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    };
};

export default connect(mapStateToProps)(Layout);