import * as React from "react";
import {ErrorInformation, ErrorState} from "../props/error";
import ErrorPage from "./error-page";

export default class ErrorBoundary extends React.Component<any, ErrorState> {

    constructor(props: any) {
        super(props);
        this.state = new ErrorState(false, "", "");
    }

    componentDidCatch(error: Error, info: ErrorInformation) {
        this.setState(() => new ErrorState(true, error.message, info.componentStack));
        // You can also log the error to an error reporting service
        // console.log(error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return <div>
                <ErrorPage message={this.state.message} stack={this.state.stack}/>
            </div>;
        }
        return this.props.children;
    }
}
