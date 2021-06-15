import React from 'react'
import {Router, Route} from 'react-router-dom'
import {CommonStore} from '../stores/CommonStore'
import {RouterStore} from '../stores/RouterStore'
import {inject, observer} from "mobx-react"
import {AppBar, Container, createStyles, Theme, Toolbar, Typography, withStyles, WithStyles} from "@material-ui/core"
import history from "../history"
import {CSSTransition} from "react-transition-group";
import AppBarCollapse from "./common/AppBarCollapse";

interface IProps {
    // Перечисляются все внешние параметры (свойства)
    // переданные явно из оъекта родительского компонента
}
interface IInjectedProps extends IProps, WithStyles<typeof styles> {
    // Перечисляются все внешние параметры (свойства)
    // переданные не явно (например, внедрением зависимости при помощи декораторов)
    commonStore: CommonStore,
    routerStore: RouterStore

}
interface IState {}
const styles = (theme: Theme) => createStyles({
    root: {
        flexGrow: 1
    },
    container: {
        maxWidth: '970px',
        '& .page': {
            position: 'static'
        }
    },
    navBar: {
        color: '#fff',
        backgroundColor: '#ee6e73'
    },
    title: {
        flexGrow: 1
    }
})
@inject('commonStore', 'routerStore')
@observer
class App extends React.Component<IProps, IState> {
    // Геттер свойства, который подводит фактически полученные props
    // под интерфейс неявно полученных props
    get injected () {
        return this.props as IInjectedProps
    }
  render() {
    const {classes, routerStore} = this.injected
    return (
        <Router history={history}>
            <div className={classes.root}>
                {/* панель приложения, "приклееная" к верхней части страницы */}
                <AppBar position='sticky' className={classes.navBar}>
                    <Toolbar>
                        <Typography variant='h6' className={classes.title}>
                            WebApp
                        </Typography>
                        {/* панель навигации */}
                        <AppBarCollapse routes={routerStore.routes} />
                    </Toolbar>
                </AppBar>
                {/* область для вывода экземпляра текущего раздела веб-приложения */}
                <Container maxWidth="sm" className={classes.container}>
                    {this.injected.routerStore.routes.map(({ path, Component }) => (
                        <Route key={path} exact path={path}>
                            {({ match }) => (
                                <CSSTransition
                                    in={match != null}
                                    timeout={300}
                                    classNames='page'
                                    unmountOnExit
                                >
                                    <div className='page'>
                                        <Component />
                                    </div>
                                </CSSTransition>
                            )}
                        </Route>
                    ))}
                </Container>
            </div>
        </Router>
    )
  }
}
export default withStyles(styles)(App)