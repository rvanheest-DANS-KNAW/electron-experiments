import * as React from 'react'
import {Component} from 'react'
import {Field, FormErrors, InjectedFormProps, reduxForm} from "redux-form"
import * as EmailValidator from 'email-validator'
import provinces from '../constants/provinces'
import {RenderInput, RenderSelect} from "../lib/form"
import {Dispatch, ReduxAction} from "../util"
import {addUser} from "../actions/formActions"
import {connect} from "react-redux"

export interface DemoFormData {
    firstName?: string
    lastName?: string
    email?: string
    province?: string
    number?: string
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
            <Field name="firstName" label="First Name" submittingFailed={this.props.submitFailed} component={RenderInput}/>
            <Field name="lastName" label="Last Name" component={RenderInput}/>
            <Field name="email" label="Email" component={RenderInput}/>
            <Field name="province" label="Province" component={RenderSelect}>
                <option/>
                {provinces.map(province => <option key={province} value={province}>{province}</option>)}
            </Field>
            <Field name="number" label="Number" component={RenderInput}/>

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
    destroyOnUnmount: false,
    validate: validate,
    shouldValidate: params => params.props.submitting
})(form)
