import React, {useRef} from "react";
import {Toast} from "primereact/toast";

export const ToastComponent = ({show, toastBody}) => {
    const toast = useRef(null);
    const showSuccess = () => {
        toast.current.show(toastBody);
    }

    if (show) {
        showSuccess()
    }

    return (
        <>
            <Toast ref={toast}/>
        </>
    )
}