import {useEffect} from "react";
import "../../styles/default/toast.css";
import {ToastProps} from "./toast-props";
import {ToastType} from "../enums/toast-type";

export default function Toast(props: ToastProps) {

    useEffect(() => {
        if (!props.duration) {
            return;
        }
        const timer = setTimeout(() => {
            props.destroy(props.id);
        }, props.duration);
        return () => clearTimeout(timer);
    }, [props.destroy, props.duration]);

    return (
        <div className={props.type === ToastType.Information ? "toast-green" : "toast-red"}>
            <div className="toast-outer">
                <div className="toast-body">
                    <div className={"toast-header"}>
                        {props.title}
                        <button className={"toast-button"} onClick={() => props.destroy(props.id)}>X</button>
                    </div>
                    <div className={"toast-body"}>{props.content}</div>
                </div>
            </div>
        </div>
    );
}
