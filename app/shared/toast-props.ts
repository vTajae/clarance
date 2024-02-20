import { ToastType } from "../enums/toast-type";

export class ToastProps {
    id: string;
    title: string;
    content: string;
    type: ToastType;
    destroy!: (id: string) => void;
    duration?: number;

    constructor(title: string, content: string, type?: ToastType, duration?: number) {
        this.id = Math.random().toString(36).substring(2, 9);
        this.title = title;
        this.content = content;
        this.type = type ? type : ToastType.Information;
        this.duration = duration ? duration : 5000;
    }
}
