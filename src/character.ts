const MensNames = [
    'William',
    'Richard',
    'Robert',
    'John',
    'Thomas',
    'Henry',
    'Edward',
    'Stephen',
    'Geoffrey',
    'Walter',
    'Gilbert',
    'Roger',
    'Alan',
    'Philip',
    'Simon',
    'Bartholomew',
    'Nicholas',
    'Peter',
    'Matthew',
    'Adam',
    'Martin',
    'Godfrey',
    'Reginald',
    'Hugh',
    'Brian',
    'Lawrence',
    'Andrew',
    'James',
    'Giles',
    'Osbert '
];

const WomensNames = [
    'Adela',
    'Agatha',
    'Alice',
    'Amabel',
    'Beatrice',
    'Cecily',
    'Constance',
    'Dionisia',
    'Edith',
    'Eleanor',
    'Emma',
    'Felicity',
    'Gundreda',
    'Hawise',
    'Isabella',
    'Joan',
    'Juliana',
    'Katherine',
    'Leticia',
    'Mabel',
    'Matilda',
    'Nichola',
    'Philippa',
    'Rosamund',
    'Sarah',
    'Sybil',
    'Thomasina',
    'Urraca',
    'Wymarc',
    'Ysenda'
];

enum Gender {
    Male,
    Female
}

type Gender2 = 'Male' | 'Female';



class Character {
    name: string;
    age: number;
    gender: Gender;

    constructor(name: string, age: number, gender: Gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }

    public sayHello(): string {
        return `Hello, my name is ${this.name}`;
    }
}