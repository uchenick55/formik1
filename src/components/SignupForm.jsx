import React from "react";
import {Formik, Form, useField, Field, ErrorMessage, useFormikContext} from "formik"; //формик с компонентами и пользовательским хуком
import * as Yup from 'yup' // валидация форм с помошью сторонней библиотеки Yup


const Composition = ({label, children, ...props}) => {
    const [field, meta] = useField(props.props) // получить доп данные (blur/error)
    return (
        <>
            <label htmlFor={props.props.id || props.props.name}>{label}</label> {/*лейб либо с props.id (которого пока нет), либо с props.name*/}
            <br/> {/*перенос стоки*/}
            {children}
            {meta.touched && meta.error && <div className='error'>{meta.error}</div>} {/*вывод ошибок если касались поля и есть ошибка*/}
            <br/>{/*перенос стоки*/}
        </>
    )
}

const MyTextArea = ({label, ...props}) => {  // вынесенная общая часть для тесктового поля
    const [field] = useField(props) // получить доп данные (blur/error)
    return (
        <Composition label={label} props={props}>
            <textarea className='text-area' {...field}/>  {/*то различие между input и textarea*/}
        </Composition>
    )
}
const MyTextInput = ({label, ...props}) => {  // вынесенная общая часть для тесктового поля
    const [field, meta] = useField(props)
    return (
        <Composition label={label} props={props}>
            <input className='text-input'  {...field}/> {/*то различие между input и textarea*/}
        </Composition>
    )
}

const MyCheckbox = ({children, ...props}) => {
    const [field, meta] = useField({...props, type: 'checkbox'})
    return (
        <div>
            <label className='checkbox-input'>
                <input type='checkbox' {...field} {...props}/>
                {children}
            </label>
            {meta.touched && meta.error && <div className='error'>{meta.error}</div>}
            <br/>
        </div>
    )
}

const MySelect = ({label, ...props}) => {
    const [field, meta] = useField(props)
    return (
        <div>
            <label htmlFor={props.id || props.name}>{label}</label>
            <select {...field} {...props}/>
            {meta.touched && meta.error && <div className='error'>{meta.error}</div>}
            <br/>
        </div>
    )
}

export const DisplayFormikState = () => {
    const props = useFormikContext();
    return  <div style={{margin: '1rem 0'}}>
        <h3 style={{fontFamily: 'monospace'}}/>
        <pre
            style={{
                background: '#f6f8fa',
                fontSize: '.65rem',
                padding: '.5rem',
            }}
        >
<strong>props</strong> ={' '}
            {JSON.stringify({props}, null, 2)}
</pre>
    </div>;
}



const SignupForm = ({onSubmitForm}) => {
    return (
        <>
            <h1>Subscribe!</h1>
            <Formik
                initialValues={{
                    firstName: "firstName",
                    lastName: 'lastName',
                    email: "email@email.em",
                    acceptedTerms: true, // добавлен для нашего чекбокса
                    jobType: "product", // добавлен для нашего select
                    message: "Textarea Field", //
                    comments: "MyTextArea",
                    picked: "Two"
                }}
                validationSchema={Yup.object({
                        firstName: Yup.string()
                            .max(15, "Must be 15 character or less")
                            .required('Required'),
                        lastName: Yup.string()
                            .max(20, "Must be 20 character or less")
                            .required('Required'),
                        email: Yup.string()
                            .email('Invalid email address')
                            .required('Required'),
                        comments: Yup.string()
                            .max(50, 'Must be 50 characters or less')
                            .required('Required'),
                        acceptedTerms: Yup.boolean()
                            .required('Required')
                            .oneOf([true], 'You must accept the terms and conditions.'),
                        jobType: Yup.string()
                            .oneOf(
                                ['designer', 'development', 'product', 'other'],
                                'Invalid Job Type'
                            )
                            .required('Required'),
                    }
                )}
                onSubmit={(values) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2)); // после отправки формы вывести alert
                        onSubmitForm(values) // колбек, который принмает результат ввода формы
                    }, 400)
                }}
            >
                {({
                      values,
                      isSubmitting,
                      handleReset,
                      errors,
                      isValid
                }) => ( // обертка для вывода значений ввода в любом месте формы паралельно (или в итоге)

                    <Form>

                        <label htmlFor="firstName">First Name</label>
                        <Field name="firstName" type="text"/>
                        <ErrorMessage name="firstName"/>

                        <label htmlFor="firstName">Textarea Field</label>
                        <Field name="message" as="textarea" className="form-textarea"/>
                        <ErrorMessage name="message"/>
                        <div>firstName: {values.message}</div>


                        <div id="my-radio-group">Picked</div>
                        <div role="group" aria-labelledby="my-radio-group">
                            <label>
                                <Field type="radio" name="picked" value="One"/>
                                One
                            </label>
                            <label>
                                <Field type="radio" name="picked" value="Two"/>
                                Two
                            </label>

                            <div>Picked: {values.picked}</div>

                        </div>

                        <MyTextInput
                            label="First Name"
                            name='firstName'
                            type='firstName'
                            placeholder='Jane'
                        />

                        <MyTextInput
                            label="Last Name"
                            name='lastName'
                            type='text'
                            placeholder='Doe'
                        />

                        <MyTextInput
                            label="Email Address"
                            name='email'
                            type='email'
                            placeholder='jane@formik.com'
                        />

                        <MyTextArea
                            label="MyTextArea"
                            name='comments'
                            type='text'
                            placeholder='Your comments to Subscribe'
                        />

                        <MySelect label='Job Type' name='jobType'>
                            <option value=''>Select a job type</option>
                            <option value='designer'>Designer</option>
                            <option value='development'>Developer</option>
                            <option value='product'>Product Manager</option>
                            <option value='other'>Other</option>
                        </MySelect>

                        <MyCheckbox name='acceptedTerms'>
                            I accept the terms and conditions
                        </MyCheckbox>

                        <button type="submit" disabled={!{isValid}}>
                            Submit
                        </button>
                        <button type='button' onClick={handleReset}>Reset</button> {/*кнопка сбора со значениям по умолчанию*/}
                        <DisplayFormikState />

                    </Form>
                )}
            </Formik>
        </>
    )
}

export default SignupForm

