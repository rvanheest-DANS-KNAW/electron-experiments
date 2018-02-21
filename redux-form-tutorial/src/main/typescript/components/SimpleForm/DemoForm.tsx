import * as React from 'react'
import {Component} from 'react'
import {Field, FormErrors, InjectedFormProps, reduxForm} from "redux-form"
import * as EmailValidator from 'email-validator'
import provinces from '../../constants/provinces'
import {RenderCheckbox, RenderComposed, RenderDatePicker, RenderInput, RenderRadio, RenderSelect} from "../../lib/form"
import {Dispatch, ReduxAction} from "../../util"
import {addUser} from "../../actions/formActions"
import {connect} from "react-redux"
import * as moment from "moment"

export interface DemoFormData {
    firstName?: string
    lastName?: string
    email?: string
    province?: string
    number?: string
    sex?: string
    birthday?: string
    coordinateX?: string
    coordinateY?: string
    coordinateZ?: string
    accept: boolean
}

interface DemoFormProps extends InjectedFormProps<DemoFormData, DemoFormProps> {
    submitForm: (name: string) => ReduxAction<string>
}

const validate = (values: DemoFormData) => {
    const errors: FormErrors<DemoFormData> = {}

    if (!values.firstName) {
        errors.firstName = "Required"
    }

    if (!values.lastName) {
        errors.lastName = "Required"
    }

    if (!values.email) {
        errors.email = "Required"
    }
    else if (!EmailValidator.validate(values.email)) {
        errors.email = "Invalid email address"
    }

    if (!values.province) {
        errors.province = "Required"
    }

    if (!values.number) {
        errors.number = "Required"
    }
    else if (!Number(values.number)) {
        errors.number = "This should be a numeric value"
    }

    if (values.birthday && !moment(values.birthday, "DD-MM-YYYY").isSameOrAfter(moment())) {
        errors.birthday = "This date should be in the future"
    }

    if (!values.accept) {
        errors.accept = "You need to check this box before submitting!"
    }

    return errors
}

class DemoForm extends Component<DemoFormProps> {
    constructor(props: DemoFormProps) {
        super(props)
    }

    showResults = async (values: DemoFormData) => {
        await new Promise(resolve => setTimeout(resolve, 500))
        window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)

        this.props.submitForm(`${values.firstName} ${values.lastName}`)

        this.props.reset()
    }

    render() {
        return <form onSubmit={this.props.handleSubmit(this.showResults)}>
            <Field name="firstName" label="First Name" component={RenderInput} required/>
            <Field name="lastName" label="Last Name" component={RenderInput} required/>
            <Field name="email" label="Email" component={RenderInput} required/>
            <Field name="province" label="Province" component={RenderSelect} required>
                <option/>
                {provinces.map(province => <option key={province} value={province}>{province}</option>)}
            </Field>
            <Field name="number" label="Favorite Number" component={RenderInput} required/>
            <Field name="sex" label="Sex" component={RenderRadio} choices={[
                {title: "male", value: "Male"},
                {title: "female", value: "Female"},
                {title: "no", value: "No, thank you"},
            ]}/>
            <Field name="birthday" label="Birthday" component={RenderDatePicker} dateFormat="DD-MM-YYYY"
                   minDate={moment()}/>
            <Field name="coordinate" label="Coordinate" component={RenderComposed}>
                <Field name="coordinateX" label="X  " component={RenderInput}/>
                <Field name="coordinateY" label="Y  " component={RenderInput}/>
                <Field name="coordinateZ" label="Z  " component={RenderInput}/>
            </Field>
            <Field name="accept" label="Acceptance" component={RenderCheckbox} text="I accept everything" required/>

            <button type="submit" disabled={this.props.submitting}>Submit</button>
        </form>
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
    submitForm: (name: string) => dispatch(addUser(name)),
})

const form = connect(null, mapDispatchToProps)(DemoForm)

export default reduxForm({
    form: 'demo',
    validate: validate,
})(form)
