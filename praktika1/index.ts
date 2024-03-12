function namespace(input: string): Record<string, any> {
    const names = input.split('.');
    let result = {};

    for (const name of names.reverse()) {
        result = { [name]: result };
    }

    return result;
}

const namespaceObject = namespace('a.b.c.d.e');
console.log(namespaceObject);