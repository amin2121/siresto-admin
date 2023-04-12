import React from "react";
import './component.scss'

export default function alert(props) {
    return (
        <div className={props.type === 'error' ? 'alert alert-error' : 'alert alert-success'}>
            <div>
                <span >{props.msg}</span>
            </div>
        </div>
    );
}