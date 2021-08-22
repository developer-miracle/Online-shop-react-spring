import React from 'react'
import {
    Button,
    createStyles,
    Grid,
    Paper,
    Step, StepContent,
    StepLabel,
    Stepper,
    Theme, Typography,
    WithStyles,
    withStyles
} from '@material-ui/core'
import {inject, observer} from "mobx-react";
import {CommonStore} from "../../stores/CommonStore";
import {ProductStore} from "../../stores/ProductStore";
import {CategoryStore} from "../../stores/CategoryStore";
import WeightSelector from '../../components/common/WeightSelector'
import SectionsSelector from '../../components/common/SectionsSelector'
import {UserStore} from "../../stores/UserStore";
import DecorSelector from "../common/DecorSelector";
interface IProps {

}

interface IInjectedProps extends IProps, WithStyles<typeof styles> {
    commonStore: CommonStore,
    productStore: ProductStore,
    categoryStore: CategoryStore,
    userStore: UserStore
}

interface IState {
    itemIdIsExist: boolean,
    activeStep: number
}

function getSteps() {
    return ['Выбор веса', 'Выбор начинки', 'Выбор оформления'];
}

function getStepContent(step: number) {
    switch (step) {
        case 0:
            return <WeightSelector/>;

        case 1:
            return <SectionsSelector/>;
        case 2:
            return <DecorSelector/>;
        default:
            return 'Unknown step';
    }
}



const styles = (theme: Theme) => createStyles({
    root: {
        fontFamily: "'Comfortaa', cursive",
        background: '#f2f2f2',
        color: '#414141',
        //color: '#424242',
        // maxWidth: '970px',
        minWidth: '300px',
        margin: '0 auto',
        padding: '10px',
    },
    imageContainer: {

    },

    img: {
        width: '100%',
    },
    item: {
        width: '100%',
        display: 'flex',
    },
    textContainer: {

        width: '100%',
        padding: '0 20px 20px 20px',
        display: 'flex',
    },
    textArt: {
        color: '#a7a7a7',
        fontWeight: 100,
        fontSize: 'small',
        display: 'flex',
        '& > *': {
            margin: 0,
        },
    },
    title: {

        fontSize: 'x-large',
        fontWeight: 400,
        margin: 0,
    },
    descriptionTitle: {
        color: '#a7a7a7',
        fontWeight: 100,
        fontSize: 'medium',
        margin: 0,
        // textAlign: 'center',
    },
    description: {
        fontSize: 'medium',
        margin: 0,
    },
    categoryTitle: {
        color: '#a7a7a7',
        fontWeight: 100,
        fontSize: 'medium',
    },
    categoryText: {

    },
    categoryContainer: {
      display: 'flex',
    },

    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
    stepper: {
        width: '100%',
    },
    ItemContainer: {
      width: '100%',
    },
})

@inject('commonStore', 'productStore', 'categoryStore', 'userStore')
@observer
class Item extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            itemIdIsExist: false,
            activeStep: 0,

        }


    }

    get injected () {
        return this.props as IInjectedProps
    }

    componentDidMount() {
        // console.log(this.injected.categoryStore.currentCategoryId)
        // console.log(this.injected.categoryStore.categories)
        // console.log(this.injected.categoryStore.name)
        // console.log(this.injected.productStore.currentProductId)

        console.log(this.injected.productStore.oneProduct)


        // Анализ строки URL
        const windowUrl = window.location.search
        const params = new URLSearchParams(windowUrl)
        const id: string = params.get('id') || ''
        if (id){
            //this.injected.categoryStore.fetchCategories()
            this.injected.productStore.fetchProductById(Number(id))
            this.setState({itemIdIsExist: true})
        }
    }

    render() {
        const setActiveStep = (activeStep: any) => this.setState({activeStep: activeStep})
        const steps = getSteps();

        const handleNext = () => {
            setActiveStep(this.state.activeStep + 1)
        };

        const handleBack = () => {
            setActiveStep(this.state.activeStep - 1)
        };

        const handleReset = () => {
            setActiveStep(this.state.activeStep - steps.length);
        };
        const { user } = this.injected.userStore
        const { loading } = this.injected.commonStore
        const { article } = this.injected.commonStore
        const { classes } = this.injected

        const { oneProduct } = this.injected.productStore




            if (!loading) {
                return(
                    <div className={classes.root}>
                        <Grid
                            container
                        >
                            <Grid
                                id={'item'}
                                className={classes.item}
                                item
                                xs={12}
                                sm={6}
                                md={6}
                                lg={6}
                                xl={6}
                            >
                               <div className={classes.imageContainer}><img id={'imgId'} className={classes.img} src={oneProduct?.image} alt="image item"/></div>
                            </Grid>
                            <Grid
                                id={'item'}
                                className={classes.item}
                                item
                                xs={12}
                                sm={6}
                                md={6}
                                lg={6}
                                xl={6}
                            >
                                <div className={classes.textContainer}>
                                    <div>
                                        <div className={classes.textArt}><p>арт. </p><p>{article + oneProduct?.id}</p></div>
                                        <p className={classes.title}>{oneProduct?.title}</p>
                                        <div className={classes.categoryContainer}>
                                            <div className={classes.categoryTitle}>категория:&nbsp;</div>
                                            <div className={classes.categoryText}>{oneProduct?.category.name}</div>
                                        </div>
                                        <div>
                                            <p className={classes.descriptionTitle}>описание</p>
                                            <p className={classes.description}>{oneProduct?.description}</p>
                                        </div>
                                        {/*<p>цена: {Store.oneProduct?.price}</p>*/}
                                    </div>
                                </div>
                            </Grid>
                            <Grid
                                id={'item'}
                                className={classes.item}
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                                xl={12}
                            >
                                {user ? <div className={classes.ItemContainer}>
                                    <div className={classes.stepper}>
                                        <Stepper activeStep={this.state.activeStep} orientation="vertical">
                                            {steps.map((label, index) => (
                                                <Step key={label}>
                                                    <StepLabel>{label}</StepLabel>
                                                    <StepContent>
                                                        <Typography>{getStepContent(index)}</Typography>
                                                        <div className={classes.actionsContainer}>
                                                            <div>
                                                                <Button
                                                                    disabled={this.state.activeStep === 0}
                                                                    onClick={handleBack}
                                                                    className={classes.button}
                                                                >
                                                                    Назад
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={handleNext}
                                                                    className={classes.button}
                                                                >
                                                                    {this.state.activeStep === steps.length - 1 ? 'Готово' : 'Далее'}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </StepContent>
                                                </Step>
                                            ))}
                                        </Stepper>
                                        {this.state.activeStep === steps.length && (
                                            <Paper square elevation={0} className={classes.resetContainer}>
                                                <Typography>Заказ сформирован, можно заказывать.</Typography>
                                                <Button onClick={handleReset} className={classes.button}>
                                                    Сброс
                                                </Button>
                                            </Paper>
                                        )}
                                    </div>
                                </div> : <div>нужно авторизоваться</div>}


                            </Grid>
                        </Grid>
                    </div>
                )
            } else {
                return ''
            }
        }
    }

export default withStyles(styles)(Item)