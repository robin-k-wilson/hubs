interface IAMDATA {
    catName: string
    dogName: string
    toys: {[toyName: string]: ToyType}
}

interface ToyType {
    name: string
    color: string
}
