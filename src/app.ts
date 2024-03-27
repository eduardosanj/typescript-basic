
//Validation data
interface Validatable {

    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLenght?: number;
    min?: number;
    max?: number;
}

function validate(validaTableInput: Validatable) {

    let isValid = true;
    if (validaTableInput.required) {
        if (validaTableInput.value === 'string') {
            isValid = isValid && validaTableInput.value.toString().trim().length !== 0;
        }
        if (validaTableInput.minLength != null && typeof validaTableInput.value === 'string') {
            isValid = isValid && validaTableInput.value.length >= validaTableInput.minLength;
        }
        if (validaTableInput.maxLenght != null && typeof validaTableInput.value === 'string') {
            isValid = isValid && validaTableInput.value.length <= validaTableInput.maxLenght;
        }
        if (validaTableInput.min != null && typeof validaTableInput.value === 'number') {
            isValid = isValid && validaTableInput.value >= validaTableInput.min;
        }
        if (validaTableInput.max != null && typeof validaTableInput.value === 'number') {
            isValid = isValid && validaTableInput.value <= validaTableInput.max;
        }
    }

    return isValid;

}

function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {

    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {

        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    }

    return adjDescriptor;

}


class ProjectInput {

    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importNode = document.importNode(this.templateElement.content, true);
        this.element = importNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();

        this.attach();
    }

    private gatherUserInput(): [string, string, number] | void {

        const enteredTitle = this.titleInputElement.value;
        const enteredDesc = this.descInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
        };

        const descValidatable: Validatable = {
            value: enteredDesc,
            required: true,
            minLength: 5
        };

        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        };

        if (!validate(titleValidatable) || !validate(descValidatable) || !validate(peopleValidatable)) {
            alert('Invalid input, please try again');
        }
        else {
            return [enteredTitle, enteredDesc, +enteredPeople];
        }
    }


    private clearInputs() {
        this.titleInputElement.value = '';
        this.descInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        console.log(this.titleInputElement.value);
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            console.log(title, desc, people);
            this.clearInputs();
        }
    }

    private configure() {
        //this.element.addEventListener('submit', this.submitHandler.bind(this));
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const prjInput = new ProjectInput();