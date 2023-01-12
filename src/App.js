import './App.css';
import React from "react";
import SignupForm from "./components/SignupForm";

let App = () => {
    let onSubmitForm = (values) => {
        console.log("вот мы и в деле", values)
    }
    return (
        <div>
            <SignupForm onSubmitForm={onSubmitForm} />
        </div>
    );
}

export default App;
