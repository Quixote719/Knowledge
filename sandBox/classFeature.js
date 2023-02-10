class Person{
    #age
    constructor(props){
        this.firstName = props.firstName
        this.lastName = props.lastName
        this.#age = props.age
    }

    get fullName(){
        return `${this.firstName} ${this.lastName}`
    }
}