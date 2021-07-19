import React, {Component} from "react"
import {Collapse, createStyles, List, ListItem, ListItemText, MenuItem} from "@material-ui/core"
import { WithStyles, withStyles, Theme } from "@material-ui/core/styles"
import ButtonAppBarCollapse from "./ButtonAppBarCollapse"



import {
    NavLink
} from 'react-router-dom'
import {
    ExpandLess, ExpandMore,
    ShoppingCart as ShoppingCartIcon, StarBorder
} from "@material-ui/icons"
import {inject, observer} from "mobx-react"
import {UserStore} from '../../stores/UserStore'
import {CartStore} from '../../stores/CartStore'
import {CategoryStore} from '../../stores/CategoryStore'
import RouteModel from "../../models/RouteModel"
import CategoryModel from "../../models/CategoryModel";

interface IProps {
    routes: Array<RouteModel>
}

interface IInjectedProps extends IProps, WithStyles<typeof styles> {
    userStore: UserStore
    cartStore: CartStore
    categoryStore: CategoryStore
}

interface IState {
    openStateMenu: boolean
}

const styles = ((theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        // position: "absolute",
        // right: 0,
    },
    buttonBar: {
        // если ширина экрана - мобильная или меньше
        [theme.breakpoints.down("xs")]: {
            // скрываем настольную версию пунктов меню навигации и аутентификации
            display: "none"
        },
        margin: "10px",
        paddingLeft: "16px",
        right: "10px",
        position: "relative",
        width: "100%",
        background: "transparent",
        display: 'flex',
        flexDirection: 'row',
        height: '60px',
    },
    buttonBarItem: {
        '&:hover': {
            color: '#039be6',
        },
        webkitTransition: 'background-color .3s',
        transition: 'background-color .3s',
        fontSize: '1rem',
        color: '#a6a6a6',
        padding: '15px',
        cursor: 'pointer',
        textDecoration: 'none',
    },
    buttonBarItemActive: {
        backgroundColor: '#fff',
        color: '#424242'

    },

    mobileButtonBarItem: {
        textDecoration: 'none',

    },
    mobileButtonBarItemActive: {
        backgroundColor: '#00b58c',
    },

    shoppingCart: {
        marginRight: '10px'
    },
    nested: {
        '&:hover': {
            color: '#039be6',
            backgroundColor: '#fcf7f1',

        },
        flexDirection: 'column',
        background: '#fcf7f1',
    },
    listItem: {
        '&:hover': {
            color: '#039be6',
            backgroundColor: '#fcf7f1',
        },
        justifyContent: 'flex-end',
        width: '140px',
    },
    listItemActive: {
        '&:hover': {
            color: '#039be6',
            backgroundColor: '#fcf7f1',
        },
        justifyContent: 'flex-end',
        width: '140px',
        background: '#fcf7f1'
    },

}))





@inject('userStore', 'cartStore', 'categoryStore')
@observer
class AppBarCollapse extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            openStateMenu: false
        }
    }



    get injected () {
        return this.props as IInjectedProps
    }

    // обработчик события "клик по иконе корзины" - переключатель видимости корзины
    handleCartIconClick = (e: React.MouseEvent) => {
        if (this.injected.cartStore.cartShown) {
            this.injected.cartStore.setCartVisibility(false)
        } else {
            this.injected.cartStore.setCartVisibility(true)
        }
    }

    handleClick = () => {
        this.setState({openStateMenu: !this.state.openStateMenu})
    }

    componentDidMount() {
        this.injected.categoryStore.fetchCategories()
    }


    render () {
        const { classes } = this.injected
        const { routes } = this.props
        const { categories } = this.injected.categoryStore
        return (
            <div className={classes.root}>
                {/* экземпляр мобильного меню */}
                <ButtonAppBarCollapse>
                    {
                        // передача значения компоненту-потомку ButtonAppBarCollapse,
                        // которое будет им автоматически получено
                        // в стандартный внешний параметр children -
                        // - представление списка пунктов меню
                        routes.map(route => {
                            if (route.visible) {
                                if (!/^Dashboard[A-z]+$/.test(route.name)) {
                                    return <MenuItem key={route.path}>
                                        <NavLink
                                            to={route.path}
                                            className={classes.mobileButtonBarItem}
                                            activeClassName={classes.mobileButtonBarItemActive}
                                            exact>
                                            {route.name}
                                        </NavLink>
                                    </MenuItem>
                                } else {
                                    return ''
                                }
                            }
                        })}
                </ButtonAppBarCollapse>
                {/* настольное меню */}
                <div className={classes.buttonBar} id="appbar-collapse">
                    {routes.map(route => {
                        if (route.visible) {
                            if (route.name.includes('торты')) {
                                return <List>
                                    <ListItem
                                        className={this.state.openStateMenu ? classes.listItemActive : classes.listItem}
                                        button onClick={this.handleClick}>
                                        {route.name.toUpperCase()}
                                        {this.state.openStateMenu ? <ExpandLess /> : <ExpandMore />}
                                    </ListItem>
                                    <Collapse in={this.state.openStateMenu} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                                {categories.map((category: CategoryModel) => {
                                                    return <ListItem button className={classes.nested}>
                                                    <ListItemText primary={
                                                        <a href="/">{category.name}</a>
                                                    } />
                                                    </ListItem>
                                                })}
                                        </List>
                                    </Collapse>
                                </List>
                            } else {
                                if (!/^Dashboard[A-z]+$/.test(route.name)) {
                                    return <NavLink
                                        key={route.path}
                                        to={route.path}
                                        // можно указать в двойных кавычках имя
                                        // класса стиля, описанного в css
                                        className={classes.buttonBarItem}
                                        // , а в данном случае создается экранирование
                                        // фигурными скобками, и внутри него
                                        // указывается имя класса стиля,
                                        // определенного в константе styles
                                        activeClassName={classes.buttonBarItemActive}
                                        exact>
                                        {route.name.toUpperCase()}
                                    </NavLink>
                                } else {
                                    return ''
                                }
                            }
                        } else {
                            return ''
                        }
                    }
                    )}
                </div>
                <div className={classes.shoppingCart} style={{display: this.injected.userStore.user ? 'inline' : 'none' }}>
                    <ShoppingCartIcon
                        onClick={this.handleCartIconClick}
                    /> {this.injected.cartStore.cartItemsCount} ({this.injected.cartStore.cartItemsTotalPrice}) грн.
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(AppBarCollapse)