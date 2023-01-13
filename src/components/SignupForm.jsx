import React from "react";
import {Formik, Form, useField, Field, ErrorMessage, useFormikContext} from "formik"; //формик с компонентами и пользовательским хуком
import * as Yup from 'yup' // валидация форм с помошью сторонней библиотеки Yup
import classes from "./common/formik1/formik1.module.css"

const CommonInputTextArea = ({label, children, ...props}) => {
    const [field, meta] = useField(props.props)  // данные onBlur и meta для обработки ошибок
    return (
        <>
            <label
                htmlFor={props.props.id || props.props.name}>{label}</label> {/*лейб либо с props.id (которого пока нет), либо с props.name*/}
            <br/> {/*перенос стоки*/}
            {children} {/*input или textarea*/}
            {meta.touched && meta.error && // если поле тронутот и вышла ошибка поля
            <div className={classes.errorText}>{meta.error}</div>} {/*красным цветом текст*/}
            <br/>{/*перенос стоки*/}
        </>
    )
}
const MyTextInput = ({label, ...props}) => {  // вынесенная общая часть для тесктового поля
    const [field, meta] = useField(props) // данные onBlur и meta для обработки ошибок

    return (
        <CommonInputTextArea label={label} props={props}> {/*композиция выод общей части InputTextArea*/}
            <input
                className={meta.touched && meta.error ? classes.errorInputTextArea : null}  {...field} {...props}/> {/*то различие между input и textarea*/}
        </CommonInputTextArea>
    )
}

const MyTextArea = ({label, ...props}) => {  // вынесенная общая часть для тесктового поля
    const [field, meta] = useField(props)  // данные onBlur и meta для обработки ошибок
    return (
        <CommonInputTextArea label={label} props={props}>{/*композиция вывод общей части InputTextArea*/}
            <textarea
                className={meta.touched && meta.error ? classes.errorInputTextArea : null} {...field} {...props}/> {/*то различие между input и textarea*/}
        </CommonInputTextArea>
    )
}


const MyCheckbox = ({children, ...props}) => {
    const [field, meta] = useField({...props, type: 'checkbox'}) // данные onBlur и meta для обработки ошибок
    return (
        <div>
            <label className='checkbox-input'>
                <input type='checkbox' {...field} {...props}/> {/*чекбокс */}
                {children}{/* текст I accept the terms and conditions*/}
            </label>
            {meta.touched && meta.error && // поле тронуто и есть ошибка
            <div className={classes.errorText}>{meta.error}</div>}
            <br/>
        </div>
    )
}

const MySelect = ({label, ...props}) => {
    const [field, meta] = useField(props) // данные onBlur и meta для обработки ошибок
    return (
        <div>
            <label htmlFor={props.id || props.name}>{label}</label> {/*заголовок select*/}
            <select {...field} {...props}/>{/* вывод select с option*/}
            {meta.touched && meta.error && // поле тронуто и есть ошибка
            <div className={classes.errorText}>{meta.error}</div>} {/*вывод текста ошибки*/}
            <br/>
        </div>
    )
}

export const DisplayFormikState = () => { // отображение всех пропсов формика
    const props = useFormikContext(); // берем все пропсы из контекста
    return <div style={{margin: '1rem 0'}}>  {/*вывод пропсов (стейта) формика*/}
        <h3 style={{fontFamily: 'monospace'}}/>
        <pre // вывести в таком виде, как представлено в оригинале
            style={{
                background: '#f6f8fa',
                fontSize: '.65rem',
                padding: '.5rem',
            }}
        >
            <strong>props</strong> ={' '}
            {JSON.stringify({props}, null, 4)}
        </pre>
    </div>;
}


const SignupForm = ({onSubmitForm}) => { // основная компонента с входным колбэком, чтобы забрать данные с форм
    return (
        <>
            <h1>Subscribe!</h1>
            <Formik
                initialValues={{ // начальные зачения форм
                    firstName: "firstName",
                    lastName: 'lastName',
                    email: "email@email.em",
                    acceptedTerms: true,
                    jobType: "product",
                    message: "Textarea Field",
                    comments: "MyTextArea",
                    picked: ""
                }}
                validationSchema={Yup.object({ // валидация форм на required, длину и заполнение полей
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
                        message: Yup.string()
                            .max(50, 'Must be 50 characters or less')
                            .required('Required'),
                        picked: Yup.string()
                            .required('Required'),
                    }
                )}
                onSubmit={(values) => { // действия по сабмиту
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2)); // после отправки формы вывести alert
                        onSubmitForm(values) // колбек, который принмает результат ввода формы
                    }, 400)
                }}
            >
                {({
                      values, // значения полей (можно взять любое)
                      isSubmitting, // флаг сабмита
                      handleReset,// обнуление полей
                      errors, // все ошибки ввода
                      isValid
                  }) => ( // обертка для вывода значений ввода в любом месте формы паралельно (или в итоге)

                    <Form>

                        <label htmlFor="firstName">First
                            Name</label>{/* альтернатива написания input с обработкой ошибок*/}
                        <Field name="firstName" type="text" placeholder='firstName'/>
                        <div className={classes.errorText}>
                            <ErrorMessage name="firstName"/>
                        </div>

                        <label htmlFor="message">Textarea
                            Field</label>{/* альтернатива написания Textarea с обработкой ошибок*/}
                        <Field name="message" as="textarea" className="form-textarea" placeholder='textarea'/>
                        <div className={classes.errorText}>
                            <ErrorMessage name="message"/>
                        </div>


                        <div>firstName: {values.message}</div>
                        {/*отображение вводимого значения values.message помимо самого поля*/}


                        <div id="my-radio-group">Picked</div>
                        {/*радиокнопки в группе*/}
                        <div role="group" aria-labelledby="my-radio-group">
                            <label>
                                <Field type="radio" name="picked" value="One"/>
                                One
                            </label>
                            <label>
                                <Field type="radio" name="picked" value="Two"/>
                                Two
                            </label>
                            <div className={classes.errorText}>
                                <ErrorMessage name="picked"/>
                            </div>


                            <div>Picked: {values.picked}</div>
                            {/*в любом месте Form можем вставить любые данные из формы*/}
                            <div>Error.comment: {errors.comments}</div>
                            {/*в любом месте Form можем вставить любые данные из формы*/}

                        </div>

                        <MyTextInput // firstNamr
                            label="First Name"
                            name='firstName'
                            type='firstName'
                            placeholder='Jane'
                        />

                        <MyTextInput // lastName
                            label="Last Name"
                            name='lastName'
                            type='text'
                            placeholder='Doe'
                        />

                        <MyTextInput // email
                            label="Email Address"
                            name='email'
                            type='email'
                            placeholder='jane@formik.com'
                        />

                        <MyTextArea // MyTextArea
                            label="MyTextArea"
                            name='comments'
                            type='text'
                            placeholder='Your comments to Subscribe'
                        />

                        <MySelect label='Job Type' name='jobType'>  {/*отрисовка select с option*/}
                            <option value=''>Select a job type</option>
                            <option value='designer'>Designer</option>
                            <option value='development'>Developer</option>
                            <option value='product'>Product Manager</option>
                            <option value='other'>Other</option>
                        </MySelect>

                        <MyCheckbox name='acceptedTerms'>  {/*чекбокс */}
                            I accept the terms and conditions
                        </MyCheckbox>

                        <button type="submit" disabled={!{isValid}}> {/*кнопка отправить форму*/}
                            Submit
                        </button>
                        <button type='button' onClick={handleReset}>Reset</button>
                        {/*кнопка сбора со значениям по умолчанию*/}
                        <DisplayFormikState/> {/*отображение всего стейта формика*/}

                    </Form>
                )}
            </Formik>
        </>
    )
}

export default SignupForm

