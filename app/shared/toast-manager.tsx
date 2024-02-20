import { createRoot } from 'react-dom/client';
import Toast from "./toast"; // Make sure the path is correct
import { ToastProps } from "./toast-props"; // Make sure the path is correct

export class ToastManager {
    private containerRef: HTMLDivElement | null = null;
    private toasts: ToastProps[] = [];
    private root: any = null;  // Add a property to hold the root

    public init(): void {
        if (typeof document !== 'undefined' && !this.containerRef) {
            const body = document.getElementsByTagName("body")[0];
            const toastContainer = document.createElement("div");
            toastContainer.id = "toast-container";
            body.insertAdjacentElement("beforeend", toastContainer);
            this.containerRef = toastContainer;

            // Create the root here and store it
            this.root = createRoot(this.containerRef);
        }
    }

    public show(slice: ToastProps): void {
        if (!this.containerRef) {
            this.init();
        }
        slice.destroy = () => this.destroy(slice.id);
        this.toasts = [slice, ...this.toasts];
        this.render();
    }

    public destroy(id: string): void {
        this.toasts = this.toasts.filter((toast: ToastProps) => toast.id !== id);
        this.render();
    }

    private render(): void {
        if (this.containerRef && this.root) {
            const toastsList = this.toasts.map((toastProps: ToastProps) => (
                <Toast key={toastProps.id} {...toastProps} />
            ));
            
            // Use the stored root for rendering
            this.root.render(toastsList);
        }
    }
}

// Factory function to create and initialize a ToastManager instance
export const createToastManager = () => {
    const toastManager = new ToastManager();
    toastManager.init();
    return toastManager;
};
